const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const catchAsync = require('../../Utiles/catchAsync');
const AppError = require('../../Utiles/appError');
const User = require('../../models/userModel');
const Email = require('../../Utiles/Email');

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
const createSendToken = (user, statusCode, res) => {
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  const token = signToken(user._id);
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({ status: 'success', token, date: { user } });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    clinic: req.user.clinic,
  });
  res.status(201).json({ status: 'success', user });
  // createSendToken(user, 201, res);
});
exports.logout = (req, res) => {
  res.clearCookie('jwt'); // This deletes the 'jwt' cookie

  res.status(200).json({ status: 'success' });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Invalid email or password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctpassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  createSendToken(user, 200, res);
});
exports.deleteUserById = catchAsync(async (req, res, next) => {
  // Find the user by ID and delete it
  const user = await User.findByIdAndDelete(req.params.id);

  // If no user found with the provided ID, return an error
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // If user deleted successfully, send a success response
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// exports.protect = catchAsync(async (req, res, next) => {
//   let token;

//   if (req.cookies.jwt) {
//     token = req.cookies.jwt;
//   }
//   if (!token) {
//     // next(
//     //   new AppError('You are not logged in! Please log in to get access', 401),
//     // );
//     return res.redirect('/login');
//   }
//   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

//   const currentUser = await User.findById(decoded.id);
//   if (!currentUser) {
//     next(
//       new AppError(
//         'The user belonging to this token does no longer exist',
//         401,
//       ),
//     );
//   }
//   if (currentUser.changedPasswordAfter(decoded.iat)) {
//     next(
//       new AppError(
//         'the user has recently changed password! Please log in again',
//         401,
//       ),
//     );
//   }
//   req.user = currentUser;
//   res.locals.user = currentUser;
//   next();
// });
exports.protect = catchAsync(async (req, res, next) => {
  //step one get the token check if it there
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.redirect('/login');
    // return next(
    //   new AppError('you are not logged in! please loging to gain access', 401),
    // );
  }
  //verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check if the user is still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    // return next(new AppError('The user belongs to this token does no longer exist', 401));
    return res.redirect('/login');
  }
  //check if the user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    // return next(new AppError('The user IS RECENTLY CHANGED HIS PASSWORD! PLEASE LOGIN AGAIN', 401));
    return res.redirect('/login');
  }
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to preform this action', 403));
    }
    next();
  };
exports.updatePassword = catchAsync(async (req, res, next) => {
  // get the user from the colection
  const user = await User.findById(req.user.id).select('+password');

  // chech if the posted password is correct
  if (!(await user.correctpassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }
  // if so update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //log the user in, send the JSONWEBTOKEN'
  createSendToken(user, 200, res);
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  console.log(req.body.email);
  //Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }
  //generate a random token
  const resetToken = user.createPasswordRestToken();
  await user.save({ validateBeforeSave: false });
  // send it to user
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({ status: 'success', message: 'Token sent to email!' });
  } catch (err) {
    user.passwordRestToken = undefined;
    user.passwordResetExpores = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email.Try again later!'), 500);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  console.log(req.body);
  //get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordRestToken: hashedToken,
    passwordResetExpores: { $gt: Date.now() },
  });

  //if token is not expired , and there is user , set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired'), 400);
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordRestToken = undefined;
  user.passwordResetExpores = undefined;
  await user.save();
  //update changepasssowrdAt proparty for the user

  //log the user in, send the JSONWEBTOKEN'JWT'
  createSendToken(user, 200, res);
});
exports.loginFailedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 failed login attempts per windowMs
  skipSuccessfulRequests: true, // skip successful requests from rate limiting
  handler: (req, res, next) => {
    next(new AppError('Too many login attempts, please try again later', 429));
  },
});

exports.emailResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2, // limit each IP to 2 attempts per windowMs
  handler: (req, res, next) => {
    next(new AppError('Too many email reset attempts, please try again later.', 429));
  },
});

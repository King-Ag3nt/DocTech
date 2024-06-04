const fs = require('fs/promises'); // Assuming you are using Node.js
const multer = require('multer');
const sharp = require('sharp');
// const stream = require('stream');
// const { v4: uuidv4 } = require('uuid');
const AppError = require('../Utiles/appError');
const catchAsync = require('../Utiles/catchAsync');
const User = require('../models/userModel');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! please upload only images', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

exports.updateMe = catchAsync(async (req, res, next) => {
  const userDate = JSON.parse(req.body.data);
  // Retrieve the old photo filename from the user document
  const user = await User.findById(req.user.id);
  if (req.file) {
    const oldPhotoFilename = user.photo;
    // If a new file is uploaded, update the filename and process the new photo
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer).rotate().toFormat('jpeg').toFile(`public/img/${req.file.filename}`);
    userDate.photo = req.file.filename;
    if (oldPhotoFilename !== 'default.jpg') {
      const oldPhotoPath = `public/img/${oldPhotoFilename}`;
      if (
        await fs
          .access(oldPhotoPath, fs.constants.F_OK)
          .then(() => true)
          .catch(() => false)
      ) {
        await fs.unlink(oldPhotoPath);
      }
    }
  }
  // Delete the old photo file
  // Update the user document with the new information
  await User.findByIdAndUpdate(req.user.id, userDate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
  });
});
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});
exports.updateTypeOfRecord = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { typeOfRecord: req.body.data });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
// const admin = require('firebase-admin');

// const serviceAccount = {
//   type: process.env.TYPE,
//   project_id: process.env.PROJECT_ID,
//   private_key_id: process.env.PRIVATE_KEY_ID,
//   private_key: process.env.PRIVATE_KEY,
//   client_email: process.env.CLIENT_EMAIL,
//   client_id: process.env.CLIENT_ID,
//   auth_uri: process.env.AUTH_URI,
//   token_uri: process.env.TOKEN_URI,
//   auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
//   client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
//   universe_domain: process.env.UNIVERSE_DOMAIN
// };

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: 'gs://doctech-33a3f.appspot.com',
// });

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new AppError('Not an image! please upload only images', 400), false);
//   }
// };

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// exports.uploadUserPhoto = upload.single('photo');
// exports.updateMe = async (req, res, next) => {
//   try {
//     const userData = JSON.parse(req.body.data);
//     const user = await User.findById(req.user.id);

//     // If a new photo is uploaded
//     if (req.file) {
//       const oldPhotoFilename = user.photo;

//       // Generate a unique filename for the photo
//       const filename = `user-${req.user.id}-${uuidv4()}.jpeg`;

//       // Upload the file to Firebase Storage
//       const fileRef = admin.storage().bucket().file(filename);
//       const metadata = {
//         contentType: req.file.mimetype,
//       };

//       await new Promise((resolve, reject) => {
//         const fileStream = fileRef.createWriteStream({ metadata });
//         fileStream.on('error', err => {
//           console.error(err);
//           reject(new Error('Error uploading file to Firebase Storage'));
//         });
//         fileStream.on('finish', () => {
//           console.log('File uploaded successfully');
//           resolve();
//         });
//         fileStream.end(req.file.buffer);
//       });

//       // Update user data with the new photo filename
//       userData.photo = filename;
//     }

//     // Update the user document with the new information
//     await User.findByIdAndUpdate(req.user.id, userData, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       status: 'success',
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Internal server error',
//     });
//   }
// };

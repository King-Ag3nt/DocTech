const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validate = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      // you neek fy el alpha
      type: String,
      required: [true, 'Please enter a name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter a email address'],
      unique: true,
      lowercase: true,
      validate: [validate.isEmail, 'Please provide a valid email address'],
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    clinic: String,
    role: {
      type: String,
      enum: ['user', 'admin', 'sa7belzreba'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minLength: 8,
      select: false,
    },
    typeOfRecord: {
      type: Boolean,
      default: true,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords doesnt match',
      },
    },
    passwordChangedAt: Date,
    passwordRestToken: String,
    passwordResetExpores: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
userSchema.virtual('queuePatients', {
  ref: 'QueuePatients',
  foreignField: 'doctor',
  localField: '_id',
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password' || this.isNew)) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctpassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
userSchema.methods.createPasswordRestToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordRestToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpores = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

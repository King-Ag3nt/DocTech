const express = require('express');

const userController = require('../controllers/userController');
const authenticationController = require('../controllers/auth/authenticationController');

const router = express.Router();

router.get('/', authenticationController.protect, userController.getAllUsers);
router.post('/login', authenticationController.loginFailedLimiter, authenticationController.login);

router.post('/forgotPassword', authenticationController.emailResetLimiter, authenticationController.forgotPassword);
router.patch('/resetPassword/:token', authenticationController.resetPassword);

router.post(
  '/signup',
  authenticationController.protect,
  authenticationController.restrictTo('admin'),
  authenticationController.signUp,
);
router.delete(
  '/deleteUser/:id',
  authenticationController.protect,
  authenticationController.restrictTo('admin'),
  authenticationController.deleteUserById,
);
router.get('/logout', authenticationController.logout);
router.patch(
  '/updateUser/:id',
  authenticationController.protect,
  userController.uploadUserPhoto,
  userController.updateMe,
);
router.patch('/updateuserHorzantel', authenticationController.protect, userController.updateTypeOfRecord);
router.patch('/updateMyPassword/:id', authenticationController.protect, authenticationController.updatePassword);

module.exports = router;

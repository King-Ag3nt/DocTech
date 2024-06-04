const express = require('express');
const authenticationController = require('../controllers/auth/authenticationController');

const PreScriptionController = require('../controllers/PreScriptionController');

const router = express.Router();
const protectAdminRoutes = [authenticationController.protect, authenticationController.restrictTo('admin')];

router.use(protectAdminRoutes);

router.post('/createPreScription', PreScriptionController.createPreScription);

module.exports = router;

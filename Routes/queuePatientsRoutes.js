// routes/queuePatientsRoutes.js

const express = require('express');

const authenticationController = require('../controllers/auth/authenticationController');
const queuePatientsController = require('../controllers/queuePatientsController');

const router = express.Router();

const protectAdminRoutes = [authenticationController.protect, authenticationController.restrictTo('admin')];

// Middleware for general protection

const protectRoutes = [authenticationController.protect];

router.use(protectRoutes);
router.get('/Queuetestingkeepalive', queuePatientsController.Queuetestingkeepalive);
// Define routes
router.route('/').get(queuePatientsController.getAllQueuePatients);
router.route('/').post(queuePatientsController.createQueuePatient);
router.route('/:id').get(queuePatientsController.getQueuePatientById);
router.route('/:id').put(queuePatientsController.updateQueuePatient);
router.patch('/updatePendingToInqueue/:id', queuePatientsController.updatePendingToInqueue);
router.post('/e7gz', queuePatientsController.e7gz);
router.post('/searchbynameorphone', queuePatientsController.searchbynameorphone);
router.route('/delete/:id').delete(queuePatientsController.updateQueueToCompleted);
router.patch('/verifybooking/:id', queuePatientsController.verifybooking);
router.route('/DeleteBooking/:id').delete(queuePatientsController.DeleteBooking);
router.use(protectAdminRoutes);

router.route('/within24hours').get(queuePatientsController.getQueuePatientsWithin24Hours);

module.exports = router;

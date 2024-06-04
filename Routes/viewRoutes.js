const express = require('express');
const veiwController = require('../controllers/viewController');
const authenticationController = require('../controllers/auth/authenticationController');
const queuePatientsController = require('../controllers/queuePatientsController');
const statisticsController = require('../controllers/statisticsController');

const router = express.Router();

// Middleware for authentication checks
const protectAdminRoutes = [authenticationController.protect, authenticationController.restrictTo('admin')];

// Middleware for general protection
const protectRoutes = [authenticationController.protect];
router.get('/login', veiwController.loginpage);
router.get('/Pricing', veiwController.Pricing);
router.get('/forgetpassword', veiwController.resetpasswordview);
router.get('/resetpassword/:token', veiwController.passwordConfirmation);
// General protected routes
router.use(protectRoutes);
router.use(queuePatientsController.getAllQueuePatients);

router.get('//:page?', veiwController.newHome);
router.get('/addRecordV2/:id', veiwController.addRecordV2);
// test record agent
router.get('/HorizontalRecord/:id', veiwController.horizontalRecord);
router.get('/HorizontalFollowUp/:id', veiwController.horizontalFollowUp);
// test record agent
router.get('/editPatientV2/:id', veiwController.editPatientV2);
router.get('/secondVisints/:id', veiwController.secondVisints);
router.get('/editRecordV2/:id', veiwController.editRecordV2);
router.get('/userAccess', veiwController.userAccess);
router.get('/preset/medication', veiwController.presetMedication);
router.get('/Dashboard', statisticsController.patientCount, veiwController.dashBoard);
router.get('/preset/Investigations', veiwController.presetInvestigations);
// test Agent Start
router.get('/QueueV2', veiwController.QueueV2);
router.get('/QueueV2/:started/:ended', queuePatientsController.getspsificdate, veiwController.QueueV2);
router.get('/addPatientV2', veiwController.addPatientV2);
router.get('/addrefdrv2', veiwController.addrefdrv2);
router.get('/ViewRefDR2/:page?', veiwController.viewrefdrv2);
router.get('/advSearch/:page?', veiwController.advSearch);
// Test Agent end
// Admin protected routes
router.use(protectAdminRoutes);
router.get('/relapses/:id', veiwController.relapses);
router.get('/AddScaleV2/:id', veiwController.AddScaleV2);
router.get('/viewScaleV2/:id', veiwController.viewScaleV2);
// Test route
router.get('/newView/:id', veiwController.newView);
router.get('/viewRelapseV2/:id', veiwController.viewRelapseV2);
router.get('/files/:id', veiwController.MRIADD);
router.get('/patientMedicalView/:id', veiwController.patientMedicalView);

// router.get('/editRecord/:id', veiwController.editRecord);
// router.get('/editPatient/:id', veiwController.editPatient);
// router.get('/editRelapse/:id', veiwController.editRelapse);
// router.get('/AddScale/:id', veiwController.AddScale);
// router.get('/AddScaleV2/:id', veiwController.AddScaleV2);
// router.get('/viewRelapses/:id', veiwController.viewRelapses);
// router.get('/oldhome', veiwController.Home);
// router.get('/history', veiwController.history);
// router.get('/patient/:id', veiwController.viewPatientRecord);
// router.get('/getAllpatients', veiwController.getAllpatients);
// router.get('/viewRefDR', veiwController.viewRefDR);
// router.get('/record/:id', veiwController.record);
// router.get('/addRefDR', veiwController.AddRefDR); // Added missing route
// router.get('/addPatient', veiwController.addPatient);
// router.get('/queue', veiwController.queue);

module.exports = router;

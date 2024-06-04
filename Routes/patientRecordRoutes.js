const express = require('express');
const patientRecordController = require('../controllers/patient/patientRecordController');
const patientScaleController = require('../controllers/patient/patientScaleController');
const authenticationController = require('../controllers/auth/authenticationController');

const advSearchController = require('../controllers/advSearchController');

const router = express.Router();
// router.use(authenticationController.protect);

router.route('/').get(patientRecordController.getAllPatientRecords);
router.get('/getPatientsByDate', patientRecordController.getPatientsByDate);
router.post(
  '/createPatientRecord/:Id',
  authenticationController.protect,
  // patientRecordController.setPatientId,
  patientRecordController.uploadMRIPhotos,
  patientRecordController.resizeMRIPhotos,

  // patientRecordController.createPatientRecord,
);
router.post(
  '/createPatientRecordNew/:Id',
  authenticationController.protect,
  patientRecordController.uploadMRIPhotos,
  patientRecordController.createPatientRecordNew,
);
router.patch(
  '/editPatientRecordNew/:Id',
  authenticationController.protect,
  patientRecordController.uploadMRIPhotos,
  patientRecordController.editPatientRecordNew,
);

router.post('/createPatientScale/:Id', patientScaleController.createPatientScale);
router.delete('/deletePatientRecord/:Id', patientRecordController.deleteRecord);

router.post('/getpatientScale/:Id', patientScaleController.getpatientScale);

router.post('/getOnePatientRecord/:Id', patientRecordController.getOnePatientRecord);

router.post('/advanced-search', advSearchController.search);

router.post('/advanced-testadvsearch', advSearchController.testadvsearch);

router.post('/searchgato', patientRecordController.dataSearch);
router.post(
  '/sendMRI',
  authenticationController.protect,
  patientRecordController.uploadMRIPhotos,
  patientRecordController.resizeFilePhoto,
);
router.get('/getPatientFiles/:Id', patientRecordController.getPatientFiles);
router.patch(
  '/updatePatientRecord/:Id',
  authenticationController.protect,
  patientRecordController.uploadMRIPhotos,
  patientRecordController.patchRecord,
);
router.delete('/deletePatientFile/:Id', patientRecordController.deleteFiles);

module.exports = router;

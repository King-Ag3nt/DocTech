const express = require('express');

const PatientLaboratoryController = require('../controllers/patient/PatientLaboratoryController');

const router = express.Router();

router.post('/createPatientLaboratory', PatientLaboratoryController.createPatientLaboratory);

router.post('/getpatientLaboratory', PatientLaboratoryController.getpatientLaboratory);
module.exports = router;

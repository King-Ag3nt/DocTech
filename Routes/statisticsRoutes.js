const express = require('express');

const statisticsController = require('../controllers/statisticsController');
// const loopingController = require('../controllers/looping');
const authenticationController = require('../controllers/auth/authenticationController');

const router = express.Router();

router.use(authenticationController.protect);
router.get('/patientCount', statisticsController.patientCount);
router.get('/trackingVisits', statisticsController.trackingVisits);
// router.get('/loopingmidnight', loopingController.loopingmidnight); // Define the loopingmidnight endpoint here

module.exports = router;

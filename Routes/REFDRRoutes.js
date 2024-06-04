const express = require('express');

const REFDRController = require('../controllers/RefDrController');
const authenticationController = require('../controllers/auth/authenticationController');

const router = express.Router();
const protectRoutes = [authenticationController.protect];
router.use(protectRoutes);
router.post('/', REFDRController.getsearchedRefDr);
router.get('/test', REFDRController.ALLgetREfdr);

router.post('/createRefDr', REFDRController.createRefDr);
router.delete('/deleteRefDr/:id', REFDRController.deleteRefDr);

module.exports = router;

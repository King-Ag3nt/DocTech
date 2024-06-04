const express = require('express');

const preSetController = require('../controllers/preSetController');
const authenticationController = require('../controllers/auth/authenticationController');

const router = express.Router();
const protectRoutes = [authenticationController.protect];
router.use(protectRoutes);

router.post('/', preSetController.createPreSet);
router.delete('/:id', preSetController.deletepreSet);
router.patch('/:id', preSetController.updatepreSet);

module.exports = router;

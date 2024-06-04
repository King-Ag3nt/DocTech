const express = require('express');

const relapsesController = require('../controllers/patient/relapesesController');

const router = express.Router();

router.route('/').post(relapsesController.createRelapse).get(relapsesController.getAllRelapses);

router.patch('/updateRelapse/:id', relapsesController.updateRelapse);
router.delete('/deleteRelapse/:id', relapsesController.deleteRelapse);

module.exports = router;

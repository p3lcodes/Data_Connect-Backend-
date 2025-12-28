const express = require('express');
const router = express.Router();
const shiftsController = require('../controllers/shiftsController');

router.post('/open', shiftsController.openShift);
router.post('/close', shiftsController.closeShift);
router.get('/open', shiftsController.getOpenShifts);
router.get('/', shiftsController.getAllShifts);

module.exports = router;

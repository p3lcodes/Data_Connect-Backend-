const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

router.post('/', paymentsController.createPayment);
router.get('/', paymentsController.getAllPayments);

module.exports = router;

const express = require('express');
const router = express.Router();
const supplyController = require('../controllers/supplyController');

router.post('/add', supplyController.addSupply);
router.get('/all', supplyController.getAllWithStock);

module.exports = router;

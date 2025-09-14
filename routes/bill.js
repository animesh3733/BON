const express = require('express');
const router = express.Router();
const {createBill, payBill} = require('../controller/bill');

router.post('/', createBill);

router.post('/pay', payBill);

module.exports = router;

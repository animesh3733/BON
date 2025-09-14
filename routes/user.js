const express = require('express');
const router = express.Router();
const {createUser, listRewards, listBills} = require('../controller/user');

router.post('/', createUser);

router.get('/:id/rewards', listRewards);

router.get('/:id/bills', listBills);

module.exports = router;

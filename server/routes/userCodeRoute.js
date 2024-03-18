const express = require('express');
const userCodeController = require('../controller/userCodeController');
const router = express.Router();

router.post('/usercode/submit', userCodeController.createUserCode);

router.get('/usercode/code', userCodeController.getUserCode);

module.exports = router;
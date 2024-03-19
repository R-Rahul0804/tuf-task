const express = require('express');
const userCodeController = require('../controller/userCodeController');
const router = express.Router();

router.post('/usercode/submit', userCodeController.createUserCode);

router.get('/usercode/code', userCodeController.getUserCode);

router.get('/usercode/code/:id',userCodeController.getSingleUserCode);

router.post('/usercode/runcode',userCodeController.runCode);

router.get('/usercode/ans', userCodeController.getSubmissionDetails);

module.exports = router;
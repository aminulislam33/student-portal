const express = require('express');
const { initiateAccountSetup, verifyOtp, createPassword } = require('../../controller/registration/studentRegistrationController');

const router = express.Router();

router.post('/initiate', initiateAccountSetup);
router.post('/verify', verifyOtp);
router.post('/password', createPassword);

module.exports = router;
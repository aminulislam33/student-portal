const express = require('express');
const {userLogin, studentLogin} = require('../controller/authController');
const router = express.Router();

router.post('/user/login', userLogin);
router.post('/student/login', studentLogin);

module.exports = router;
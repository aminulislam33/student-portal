const express = require('express');
const { getProfile, passwordReset } = require('../controller/userController');
const router = express.Router();

router.get('/profile', getProfile);
router.post('/reset-password', passwordReset);

module.exports = router;
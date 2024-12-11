const express = require('express');
const { getProfile, passwordReset } = require('../controller/profileController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();
router.use(verifyToken);

router.get('/profile', getProfile);
router.post('/reset-password', passwordReset);

module.exports = router;
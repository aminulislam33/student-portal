const express = require('express');
const { getProfile, updateProfile, changePassword } = require('../controller/profileController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(verifyToken);

router.get('/', getProfile);
router.put('/update', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;
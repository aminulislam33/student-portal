const express = require('express');
const { getProfile, updateProfile, changePassword, uploadProfilePhoto } = require('../controller/profileController');
const { verifyToken } = require('../middlewares/authMiddleware');
const uploadToCloudinary = require('../config/cloudinary');

const router = express.Router();

router.get('/', getProfile);
router.put('/update', updateProfile);
router.put('/change-password', changePassword);
router.put('/upload', uploadToCloudinary.single("profilePicture"), uploadProfilePhoto);

module.exports = router;
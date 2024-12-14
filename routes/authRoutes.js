const express = require('express');
const login = require('../controller/authController');
const { registerAdmin } = require('../controller/adminController');

const router = express.Router();

router.post('/login', login);
router.post('/register', registerAdmin);

module.exports = router;
const express = require('express');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { registerAdmin, getAllUsers } = require('../controller/adminController');

const router = express.Router();

router.post('/register', registerAdmin);

router.use(isAdmin)

router.get('/users', getAllUsers);

module.exports = router;
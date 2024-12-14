const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const { getAllUsers } = require('../controller/adminController');

const router = express.Router();
router.use(isAdmin)

router.get('/users', getAllUsers);

module.exports = router;
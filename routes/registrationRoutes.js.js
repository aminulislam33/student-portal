const express = require('express');
const {addStudent} = require('../controller/studentController');
const { isAdmin } = require('../middlewares/authMiddleware');
const addTeacher = require('../controller/facultyController');
const router = express.Router();

router.use(isAdmin);
router.post('/student', addStudent);

module.exports = router;
const express = require('express');
const {addStudent} = require('../controller/studentController');
const addTeacher = require('../controller/teacherController');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(isAdmin);
router.post('/student', addStudent);
router.post('/teacher', addTeacher);

module.exports = router;
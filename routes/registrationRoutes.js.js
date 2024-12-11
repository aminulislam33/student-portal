const express = require('express');
const addStudent = require('../controller/studentController');
const addTeacher = require('../controller/teacherController');
const router = express.Router();

router.post('/student', addStudent);
router.post('/teacher', addTeacher);

module.exports = router;
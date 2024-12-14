const express = require('express');
const {addStudent} = require('../controller/studentController');
const { isAdmin } = require('../middlewares/authMiddleware');
const addTeacher = require('../controller/professorController');
const router = express.Router();

// router.use(isAdmin);
router.post('/student', addStudent);
router.post('/teacher', addTeacher);

module.exports = router;
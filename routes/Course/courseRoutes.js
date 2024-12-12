const express = require('express');
const { addCourse, getAllCourses } = require('../../controller/Course/courseController');
const router = express.Router();

router.post('/add', addCourse);
router.get('/', getAllCourses);

module.exports = router;
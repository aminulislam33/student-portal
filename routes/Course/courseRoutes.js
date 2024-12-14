const express = require('express');
const { addCourse, getAllCourses } = require('../../controller/Course/courseController');
const { isAdmin } = require('../../middlewares/authMiddleware');
const router = express.Router();

// router.use(isAdmin);
router.post('/add', addCourse);
router.get('/', getAllCourses);

module.exports = router;
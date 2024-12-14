const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const { addCourse, getAllCourses, getCourse, updateCourse, deleteCourse } = require('../controller/courseController');
const router = express.Router();

router.use(isAdmin);
router.post('/add', addCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;
const express = require('express');
const { getStudentDetails, getAllStudents } = require('../controller/studentController');
const router = express.Router();

router.get('/:studentId', getStudentDetails);
router.get('/', getAllStudents);

module.exports = router;
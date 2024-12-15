const express = require('express');
const { getStudentDetails, getAllStudents, addStudent, updateStudent, deleteStudent } = require('../controller/studentController');
const router = express.Router();

router.post('/add', addStudent);
router.get('/', getAllStudents);
router.get('/:studentId', getStudentDetails);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;
const express = require('express');
const { getStudentDetails, getAllStudents, addStudent, updateStudent, deleteStudent, initiateAccountSetup, verifyOtp, createPassword } = require('../controller/studentController');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/details', getStudentDetails);

router.use(isAdmin);
router.post('/add', addStudent);
router.get('/', getAllStudents);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;
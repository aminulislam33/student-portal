const express = require('express');
const { addFaculty, getAllFaculties, getFacultyById, updateFaculty, deleteFaculty, verifyOtp, createPassword, initiateAccountSetup } = require('../controller/facultyController');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/initiate', initiateAccountSetup);
router.post('/verify', verifyOtp);
router.post('/password', createPassword);

router.use(isAdmin);
router.post('/add', addFaculty);
router.get('/', getAllFaculties);
router.get('/:id', getFacultyById);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);

module.exports = router;
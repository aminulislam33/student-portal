const express = require('express');
const { addFaculty, getAllFaculties, getFacultyById, updateFaculty, deleteFaculty } = require('../controller/facultyController');
const router = express.Router();

router.post('/add', addFaculty);
router.get('/', getAllFaculties);
router.get('/:id', getFacultyById);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);

module.exports = router;
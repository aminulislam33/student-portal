const express = require('express');
const { addSemester, getAllSemesters, getSemesterById, updateSemester, deleteSemester } = require('../controller/semesterController.js');
const { isHOD } = require('../middlewares/authMiddleware.js');
const router = express.Router();

// router.use(isHOD);
router.post('/add', addSemester);
router.get('/', getAllSemesters);
router.get('/:id', getSemesterById);
router.put('/:id', updateSemester);
router.delete('/:id', deleteSemester);

module.exports = router;
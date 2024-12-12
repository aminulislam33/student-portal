const express = require('express');
const { addSemester, getAllSemesters } = require('../../controller/Semester/semesterController');
const { route } = require('../registrationRoutes.js');
const router = express.Router();

router.post('/add', addSemester);
router.get('/', getAllSemesters);

module.exports = router;
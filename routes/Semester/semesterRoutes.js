const express = require('express');
const { addSemester, getAllSemesters } = require('../../controller/Semester/semesterController');
const { route } = require('../registrationRoutes.js');
const { isHOD } = require('../../middlewares/authMiddleware.js');
const router = express.Router();

router.use(isHOD);
router.post('/add', addSemester);
router.get('/', getAllSemesters);

module.exports = router;
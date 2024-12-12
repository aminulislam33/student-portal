const express = require('express');
const { getStudentDetails } = require('../controller/studentController');
const router = express.Router();

router.get('/:studentId', getStudentDetails);

module.exports = router;
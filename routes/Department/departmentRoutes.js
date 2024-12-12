const express = require('express');
const { addDepartment, getAllDepartments } = require('../../controller/Department/departmentController');
const router = express.Router();

router.post('/add', addDepartment);
router.get('/', getAllDepartments);

module.exports = router;
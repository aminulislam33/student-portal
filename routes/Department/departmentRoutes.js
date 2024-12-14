const express = require('express');
const { addDepartment, getAllDepartments } = require('../../controller/Department/departmentController');
const { isAdmin } = require('../../middlewares/authMiddleware');
const router = express.Router();

// router.use(isAdmin);
router.post('/add', addDepartment);
router.get('/', getAllDepartments);

module.exports = router;
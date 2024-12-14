const express = require('express');
const { addDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment } = require('../controller/departmentController');
const { isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(isAdmin);
router.post('/add', addDepartment);
router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

module.exports = router;
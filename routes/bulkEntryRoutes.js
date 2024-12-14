const express = require('express');
const multer = require('multer');
const { bulkEntryOfProfessors } = require('../controller/BulkEntry/professorsBulkEntryController');
const { bulkEntryOfSemesters } = require('../controller/BulkEntry/semestersBulkEntryController');
const { bulkEntryOfSubjects } = require('../controller/BulkEntry/subjectsBulkEntryController');
const { bulkEntryOfStudents } = require('../controller/BulkEntry/studentsBulkEntryController');
const { bulkEntryOfMarks } = require('../controller/BulkEntry/marksBulkEntryController');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/professors',upload.single('file'), bulkEntryOfProfessors);
router.post('/semesters',upload.single('file'), bulkEntryOfSemesters);
router.post('/subjects',upload.single('file'), bulkEntryOfSubjects);
router.post('/students',upload.single('file'), bulkEntryOfStudents);
router.post('/marks',upload.single('file'), bulkEntryOfMarks);

module.exports = router;
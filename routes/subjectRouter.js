const express = require("express");
const { addSubject, getAllSubjects } = require("../controller/subjectController");
const router = express.Router();

router.post("/add", addSubject);
router.get("/", getAllSubjects);

module.exports = router;
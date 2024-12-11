const express = require("express");
const { addSubject } = require("../controller/subjectController");
const router = express.Router();

router.post("/add", addSubject);

module.exports = router;
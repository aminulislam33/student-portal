const express = require("express");
const { addMarks } = require("../controller/marksController");
const router = express.Router();

router.post("/add", addMarks);

module.exports = router;
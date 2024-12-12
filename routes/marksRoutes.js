const express = require("express");
const { addMarks, updateMarks } = require("../controller/marksController");
const router = express.Router();

router.post("/add", addMarks);
router.put("/update", updateMarks);

module.exports = router;
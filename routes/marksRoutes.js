const express = require("express");
const { addMarks, updateMarks, getAllMarks } = require("../controller/marksController");
const router = express.Router();

router.post("/add", addMarks);
router.put("/update", updateMarks);
router.post("/", getAllMarks);

module.exports = router;
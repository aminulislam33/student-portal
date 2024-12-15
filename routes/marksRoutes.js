const express = require("express");
const { addMarks, updateMarks, getMarksOfStudent, deleteMarks } = require("../controller/marksController");
const { isProfessor } = require("../middlewares/authMiddleware");
const router = express.Router();

// router.use(isProfessor);
router.post("/add", addMarks);
router.post("/", getMarksOfStudent);
router.put("/", updateMarks);
router.delete("/delete", deleteMarks);

module.exports = router;
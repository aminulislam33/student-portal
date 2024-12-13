const express = require("express");
const { addMarks, updateMarks, getAllMarks } = require("../controller/marksController");
const { isProfessor } = require("../middlewares/authMiddleware");
const router = express.Router();

router.use(isProfessor);
router.post("/add", addMarks);
router.put("/update", updateMarks);
router.post("/", getAllMarks);

module.exports = router;
const express = require("express");
const { addSubject, getAllSubjects, getSubjectById, deleteSubject, updateSubject } = require("../controller/subjectController");
const { isHOD } = require("../middlewares/authMiddleware");
const router = express.Router();

// router.use(isHOD);
router.post("/add", addSubject);
router.get("/", getAllSubjects);
router.get("/:id", getSubjectById);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

module.exports = router;
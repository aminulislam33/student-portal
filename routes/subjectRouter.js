const express = require("express");
const { addSubject, getAllSubjects } = require("../controller/subjectController");
const { isHOD } = require("../middlewares/authMiddleware");
const router = express.Router();

router.use(isHOD);
router.post("/add", addSubject);
router.get("/", getAllSubjects);

module.exports = router;
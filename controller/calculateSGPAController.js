const Student = require("../models/Student");
const calculateSGPA = require("../utils/calculateSGPA");

const calculateSGPAController = async (req, res) => {
  const { studentId } = req.body;

  try {
    const student = await Student.findById(studentId)
        .populate("currentSemester", "semesterNumber subjects");

    const sgpa = await calculateSGPA(studentId, student.currentSemester.subjects);
    return res.status(200).json({ sgpa });
  } catch (error) {
    console.error("Error calculating SGPA:", error);
    return res.status(500).json({ message: "Failed to calculate SGPA" });
  }
};

module.exports = calculateSGPAController;
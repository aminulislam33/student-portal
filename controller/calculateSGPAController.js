const Student = require("../models/Student");
const User = require("../models/User");
const calculateSGPA = require("../utils/calculateSGPA");

const calculateGPAController = async (req, res) => {
  const userId = req.userId;
  console.log("userId: ", userId);

  try {
    const user = await User.findById(userId);

    const student = await Student.findOne({
      DBid: user._id,
    }).populate({
      path: "currentSemester", 
      select: "semesterNumber",
      populate: "subjects",
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.currentSemester || !student.currentSemester.subjects) {
      return res.status(400).json({
        message: "Current semester or subjects not found for student",
      });
    }

    const sgpa = await calculateSGPA(student, student.currentSemester.subjects);

    return res.status(200).json({ sgpa });
  } catch (error) {
    console.error("Error calculating SGPA:", error.message);
    return res.status(500).json({ message: "Failed to calculate SGPA", error: error.message });
  }
};

module.exports = calculateGPAController;
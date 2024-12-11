const calculateSGPA = require("../utils/calculateSGPA");

const calculateSGPAController = async (req, res) => {
  const { studentId, semesterSubjects } = req.body;

  try {
    const sgpa = await calculateSGPA(studentId, semesterSubjects);
    return res.status(200).json({ sgpa });
  } catch (error) {
    console.error("Error calculating SGPA:", error);
    return res.status(500).json({ message: "Failed to calculate SGPA" });
  }
};

module.exports = calculateSGPAController;
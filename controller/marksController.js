const Marks = require("../models/Marks");

const addMarks = async (req, res) => {
  const { studentId, subjectId, semester, midSemMarks, endSemMarks, internalAssessment } = req.body;
  
  try {

    const marksEntry = new Marks({
      studentId,
      subjectId,
      semester,
      midSemMarks,
      endSemMarks,
      internalAssessment,
    });

    await marksEntry.save();
    return res.status(201).json({ message: "Marks added successfully", marks: marksEntry });

  } catch (error) {
    return res.status(500).json({ message: "Failed to add marks", error: error.message });
  }
};

module.exports = {
  addMarks,
};
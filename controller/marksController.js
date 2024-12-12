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

const updateMarks = async (req, res) => {
  const { studentId, subjectId, semester, midSemMarks, endSemMarks, internalAssessment } = req.body;

  try {
    const existMarks = await Marks.findOne({ studentId, subjectId, semester });
    if (!existMarks) {
      return res.status(400).json({ message: `No marks found for this student ${studentId} and subject ${subjectId}` });
    }

    existMarks.midSemMarks = midSemMarks ?? existMarks.midSemMarks;
    existMarks.endSemMarks = endSemMarks ?? existMarks.endSemMarks;
    existMarks.internalAssessment = internalAssessment ?? existMarks.internalAssessment;

    await existMarks.save();

    return res.status(200).json({ message: "Marks updated successfully", marks: existMarks });
  } catch (error) {
    console.error("Error updating marks:", error);
    return res.status(500).json({ message: "Failed to update marks", error: error.message });
  }
};

module.exports = {
  addMarks,
  updateMarks
};
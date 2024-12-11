const Subject = require("../models/Subject");

const addSubject = async (req, res) => {
  const { name, code, credits, type, fullMarks } = req.body;

  if (!name || !code || !credits || !type || !fullMarks) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingSubject = await Subject.findOne({ code });
    if (existingSubject) {
      return res.status(400).json({ message: "Subject already exists" });
    }

    const newSubject = new Subject({
      subjectName: name,
      subjectCode: code,
      credits,
      type,
      fullMarks
    });

    await newSubject.save();

    return res.status(201).json({ message: "Subject added successfully", subject: newSubject });
  } catch (error) {
    console.error("Error adding subject:", error);
    return res.status(500).json({ message: "Error adding subject", error: error.message });
  }
};

module.exports = {
  addSubject,
};
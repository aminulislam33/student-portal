const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  midSemMarks: {
    type: Number,
    required: true,
  },
  endSemMarks: {
    type: Number,
    required: true,
  },
  internalAssessment: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Marks", marksSchema);
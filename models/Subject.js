const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
    unique: true
    },
  subjectName: {
    type: String,
    required: true
    },
  fullMarks: {
    type: Number,
    required: true
    },
  credits: {
    type: Number,
    required: true
    },
  type: {
    type: String,
    enum: ["theory", "lab", "other"],
    required: true
    },
});

module.exports = mongoose.model("Subject", subjectSchema);
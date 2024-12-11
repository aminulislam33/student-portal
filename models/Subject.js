const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
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
    enum: ["theory", "lab"],
    required: true
    },
});

module.exports = mongoose.model("Subject", subjectSchema);
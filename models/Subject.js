const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
    },
    semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Semester",
    },
    subjectCode: {
        type: String,
        required: true,
        unique: true,
    },
    subjectName: {
        type: String,
        required: true,
    },
    fullMarks: {
        type: Number,
        required: true,
    },
    credits: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["theory", "lab", "other"],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Subject", subjectSchema);
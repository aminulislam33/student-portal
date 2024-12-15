const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,  
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
    },
    semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Semester",
        required: true,
    },
    midSemMarks: {
        type: Number,
        min: 0,
    },
    endSemMarks: {
        type: Number,
        min: 0,
    },
    internalAssessment: {
        type: Number,
        min: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model("Marks", marksSchema);
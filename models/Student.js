const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    DBid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true,
    },
    studentID: {
        type: String,
        unique: true,
        required: true,
    },
    program: {
        type: String,
        required: true,
    },
    yearOfAdmission: {
        type: String,
        required: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    },
    currentSemester: {
        type: mongoose.Schema.Types.ObjectId
    },
});

module.exports = mongoose.model("Student", studentSchema);
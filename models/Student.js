const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    DBid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
    },
    EnrollmentId: {
        type: String,
        unique: true,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    yearOfAdmission: {
        type: Number,
        required: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
    },
    currentSemester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Semester",
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
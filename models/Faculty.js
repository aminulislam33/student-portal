const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
    DBid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
    },
    facultyID: {
        type: String,
        unique: true,
        required: true,
    },
    designation: {
        type: String,
        required: true,
        enum: ["Assistant Professor", "Associate Professor", "Professor"],
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
    joiningYear: {
        type: Number,
        required: true,
    },
    isHOD: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model("Faculty", facultySchema);
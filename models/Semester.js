const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
    semesterNumber: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                return v > this.startDate;
            },
            message: "End date must be after the start date.",
        },
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
    }],
    totalCredits: {
        type: Number,
        default: 0,
    },
    totalMarks: {
        type: Number,
        default: 0,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    }],
}, { timestamps: true });

module.exports = mongoose.model('Semester', semesterSchema);
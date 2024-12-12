const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
    semesterNumber: {
        type: Number,
        required: true,
        unique: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    totalCredits: {
        type: Number,
        default: 0
    },
    totalMarks: {
        type: Number,
        default: 0 
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
}, {timestamps: true});

const Semester = mongoose.model('Semester', semesterSchema);

module.exports = Semester;
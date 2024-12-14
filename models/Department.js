const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    abbreviation: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
    },
    head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }],
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
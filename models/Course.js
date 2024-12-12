const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["Undergraduate", "Postgraduate", "Doctorate"],
    },
    duration: {
        type: Number,
        required: true,
        min: 1, // Minimum duration (in years)
    },
    totalCredits: {
        type: Number,
        required: true,
    },
    departments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    }],
}, {timestamps: true});

module.exports = mongoose.model('Course', courseSchema);
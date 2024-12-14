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
        min: 1,
    },
    totalCredits: {
        type: Number,
    },
    departments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
    }],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
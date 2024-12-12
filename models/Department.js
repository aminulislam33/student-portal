const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  abbreviation: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  head: {
    type: String,
    required: true,
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course' 
  }]
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
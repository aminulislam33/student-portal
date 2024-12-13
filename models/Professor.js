const mongoose = require("mongoose");
const User = require("./User");

const teacherSchema = new mongoose.Schema({
  DBid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true, 
    },
  employeeID: {
    type: String,
    unique: true,
    required: true,
  },
  designation: {
    type: String,
    required: true,
    enum: ["Assistant Professor", "Associate Professor", "Professor"]
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  },
  isHOD: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Teacher", teacherSchema);
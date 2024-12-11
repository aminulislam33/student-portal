const mongoose = require("mongoose");
const User = require("./User");

const studentSchema = new mongoose.Schema({
    DBid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true, 
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
    type: String,
    required: true,
  },
});

module.exports = User.discriminator("Student", studentSchema);
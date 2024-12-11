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
  post: {
    type: String,
    required: true,
    enum: ["Assistant Professor", "Associate Professor", "Professor"]
  },
  department: {
    type: String,
    required: true,
    enum: ["AE&AM", "CE", "CST", "EE", "ETC", "IT", "ME", "MET", "MN"]
  },
});

module.exports = User.discriminator("Teacher", teacherSchema);
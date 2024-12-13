const Teacher = require("../models/Professor");
const addUser = require("../utils/addUser");

const addTeacher = async (req, res) => {
  const { fullName, email, phone, gender, password, employeeID, designation, department } = req.body;

  try {
    const newUser = await addUser(fullName, email, phone, gender, password);

    const newTeacher = new Teacher({
      DBid: newUser._id,
      employeeID,
      designation,
      department,
    });

    await newTeacher.save();

    res.status(201).json({message: 'Teacher added successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occurred while adding teacher' });
  }
};

module.exports = addTeacher;
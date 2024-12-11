const Teacher = require("../model/Teacher");
const addUser = require("../utils/addUser");

const addTeacher = async (req, res) => {
  const { fullName, email, phone, photo, gender, password, employeeID, post, department } = req.body;

  try {
    const newUser = await addUser(fullName, email, phone, photo, gender, password);

    const newTeacher = new Teacher({
      DBid: newUser._id,
      employeeID,
      post,
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
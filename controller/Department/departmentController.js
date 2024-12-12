const Department = require("../../models/Department");

const addDepartment = async (req, res) => {
  const { name, description, abbreviation, head, courses } = req.body;

  try {
    const existingDepartment = await Department.findOne({ abbreviation });
    if (existingDepartment) {
      return res.status(400).json({ message: 'Department already exists with the abbreviation' });
    }

    const newDepartment = new Department({
      name,
      description,
      abbreviation,
      head,
      courses,
    });

    await newDepartment.save();

    return res.status(201).json({ message: 'Department added successfully', department: newDepartment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to add department', error: error.message });
  }
};

const getAllDepartments = async (req,res)=>{
  try {
    const allDepartments = await Department.find({});
    if(!allDepartments){return res.status(400).json({message: "Departments not found"})};

    return res.status(200).json({message: "Department fetch successful", allDepartments});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Server error", error: error.message});
  }
};

module.exports = {
  addDepartment,
  getAllDepartments
};
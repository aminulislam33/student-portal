const Department = require("../models/Department");
const Faculty = require("../models/Faculty");
const addUser = require("../utils/addUser");

const addFaculty = async (req, res) => {
  const { fullName, email, phone, gender, employeeID, designation, department, joiningYear } = req.body;

  try {
    const newUser = await addUser(fullName, email, phone, gender);
    const userId = newUser?._id || newUser;

    const getDepartment = await Department.findOne({abbreviation: department});
    if(!getDepartment){
      return res.status(404).json({message: `Department with abbreviation '${department}' not found.`});
    }


    const newFaculty = new Faculty({
      DBid: userId,
      employeeID,
      designation,
      department: getDepartment._id,
      joiningYear
    });

    await newFaculty.save();

    if (department) {
      try {
        const getDepartment = await Department.findOne({ abbreviation: department });
    
        if (!getDepartment) {
          console.error(`Department with abbreviation '${department}' not found.`);
          return res.status(404).json({ message: `Department with abbreviation '${department}' not found.` });
        }
    
        getDepartment.faculties.addToSet(newFaculty._id);
    
        await getDepartment.save();
      } catch (error) {
        console.error('Error adding faculty to department:', error);
        return res.status(500).json({ message: 'Error adding faculty to department' });
      }
    }

    res.status(201).json({ message: 'Faculty added successfully' });
  } catch (error) {
    console.error('Error adding faculty:', error);
    res.status(500).json({ message: 'Error occurred while adding faculty' });
  }
};

const updateFaculty = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phone, gender, employeeID, designation, department } = req.body;

  try {
    let departmentId = null;
    if (department) {
      const getDepartment = await Department.findOne({ abbreviation: department });
      if (!getDepartment) {
        return res.status(404).json({ message: "Department not found" });
      }
      departmentId = getDepartment._id;
    }

    const updatedFields = {
      ...(fullName && { fullName }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(gender && { gender }),
      ...(employeeID && { employeeID }),
      ...(designation && { designation }),
      ...(departmentId && { department: departmentId }),
    };

    const updatedFaculty = await Faculty.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updatedFaculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    if (departmentId) {
      await Department.updateMany({ faculties: id }, { $pull: { faculties: id } });

      await Department.findByIdAndUpdate(departmentId, { $addToSet: { faculties: id } });
    }

    res.status(200).json({
      message: 'Faculty updated successfully',
      faculty: updatedFaculty,
    });
  } catch (error) {
    console.error('Error updating faculty:', error);
    res.status(500).json({ message: 'Error occurred while updating faculty' });
  }
};

const deleteFaculty = async (req, res) => {
  const { id } = req.params;

  try {
    const faculty = await Faculty.findById(id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    await Department.updateMany(
      { faculties: id },
      { $pull: { faculties: id } }
    );

    await faculty.deleteOne();

    res.status(200).json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({ message: 'Error occurred while deleting faculty' });
  }
};

const getFacultyById = async (req, res) => {
  const { id } = req.params;

  try {
    const faculty = await Faculty.findById(id)
      .populate('department', 'name abbreviation')
      .populate('DBid', 'fullName email phone gender photo');

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.status(200).json({ faculty });
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ message: 'Error occurred while fetching faculty' });
  }
};

const getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find()
      .populate('department', 'name abbreviation')
      .populate('DBid', 'fullName email phone gender photo');

    if (!faculties || faculties.length === 0) {
      return res.status(404).json({ message: 'No faculties found' });
    }

    res.status(200).json({ faculties });
  } catch (error) {
    console.error('Error fetching faculties:', error);
    res.status(500).json({ message: 'Error occurred while fetching faculties' });
  }
};

module.exports = {
  addFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyById,
  getAllFaculties
};
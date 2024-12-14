const Department = require("../models/Department");
const Course = require("../models/Course");
const Marks = require("../models/Marks");
const Semester = require("../models/Semester");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Teacher = require("../models/Faculty");

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

const getDepartmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await Department.findById(id).populate('head', 'fullName email').populate('courses', 'name');
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    return res.status(200).json({ message: 'Department fetched successfully', department });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch department', error: error.message });
  }
};

const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, description, abbreviation, head, courses } = req.body;

  try {
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const updatedFields = {
      ...(name && { name }),
      ...(description && { description }),
      ...(abbreviation && { abbreviation }),
      ...(head && { head }),
      ...(courses && { courses }),
    };

    const updatedDepartment = await Department.findByIdAndUpdate(id, updatedFields, {
      new: true,
    }).populate("head", "fullName email").populate("courses", "name");

    if (courses && courses.length > 0) {
      await Course.updateMany({ _id: { $in: courses } }, { $addToSet: { departments: id } });

      await Course.updateMany({ departments: id, _id: { $nin: courses } }, { $pull: { departments: id } });
    }

    if (head) {
      await Teacher.updateMany({ department: id }, { isHOD: false });

      await Teacher.findByIdAndUpdate(head, { isHOD: true });
    }

    return res.status(200).json({
      message: "Department updated successfully",
      department: updatedDepartment,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    return res.status(500).json({
      message: "Failed to update department",
      error: error.message,
    });
  }
};

const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await Course.updateMany({ departments: id }, { $pull: { departments: id } });

    await Subject.deleteMany({ department: id });

    await Marks.deleteMany({ department: id });

    await Teacher.updateMany({ department: id }, { department: null, isHOD: false });

    await Student.updateMany({ department: id }, { department: null });

    await Semester.deleteMany({ department: id });

    await department.deleteOne();

    return res.status(200).json({ message: 'Department and all associated data cleaned up successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete department', error: error.message });
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
    .populate('head', 'fullName email')
    .populate('courses', 'name');
    if (!departments.length) {
      return res.status(404).json({ message: 'No departments found' });
    }
    return res.status(200).json({ message: 'Departments fetched successfully', departments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch departments', error: error.message });
  }
};

module.exports = {
  addDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getAllDepartments
};
const Course = require("../models/Course");
const Department = require("../models/Department");

const addCourse = async (req, res) => {
  const { name, type, duration, totalCredits, departments } = req.body;

  try {
    const existingCourse = await Course.findOne({ name });
    if (existingCourse) {
      return res.status(400).json({ message: "Course with this name already exists." });
    }

    const departmentDocs = await Department.find({ abbreviation: { $in: departments } });

    if (departmentDocs.length !== departments.length) {
      const foundAbbreviations = departmentDocs.map((dep) => dep.abbreviation);
      const missing = departments.filter((abbreviation) => !foundAbbreviations.includes(abbreviation));
      return res.status(404).json({
        message: `Departments with the following abbreviations were not found: ${missing.join(", ")}.`,
      });
    }

    const departmentIds = departmentDocs.map((department) => department._id);

    const newCourse = new Course({
      name,
      type,
      duration,
      totalCredits,
      departments: departmentIds,
    });

    await newCourse.save();

    await Department.updateMany(
      { _id: { $in: departmentIds } },
      { $push: { courses: newCourse._id } },
    );

    res.status(201).json({ message: "Course added successfully!", course: newCourse });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ message: "An error occurred while adding the course.", error: error.message });
  }
};

const getCourse = async (req, res) => {
    const { id } = req.params;
  
    try {
      const course = await Course.findById(id).populate("departments", "name abbreviation");
  
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      res.status(200).json({ course });
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "An error occurred while fetching the course." });
    }
  };
  
  const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { name, type, duration, totalCredits, departments } = req.body;
  
    try {
      const course = await Course.findById(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      let departmentIds = null;
  
      if (departments) {
        const departmentDocs = await Department.find({ abbreviation: { $in: departments } });
  
        if (departmentDocs.length !== departments.length) {
          const foundAbbreviations = departmentDocs.map((dep) => dep.abbreviation);
          const missing = departments.filter((abbreviation) => !foundAbbreviations.includes(abbreviation));
          return res.status(404).json({
            message: `Departments with the following abbreviations were not found: ${missing.join(", ")}.`,
          });
        }
  
        departmentIds = departmentDocs.map((department) => department._id);
  
        await Department.updateMany({ courses: id }, { $pull: { courses: id } });
  
        await Department.updateMany({ _id: { $in: departmentIds } }, { $addToSet: { courses: id } });
      }
  
      const updatedFields = {
        ...(name && { name }),
        ...(type && { type }),
        ...(duration && { duration }),
        ...(totalCredits && { totalCredits }),
        ...(departmentIds && { departments: departmentIds }),
      };
  
      const updatedCourse = await Course.findByIdAndUpdate(id, updatedFields, { new: true });
  
      res.status(200).json({ message: "Course updated successfully!", course: updatedCourse });
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ message: "An error occurred while updating the course." });
    }
  };  

const deleteCourse = async (req, res) => {
    const { id } = req.params;
  
    try {
      const course = await Course.findById(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      await Department.updateMany({ courses: id }, { $pull: { courses: id } });
  
      await course.deleteOne();
  
      res.status(200).json({ message: "Course deleted successfully!" });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "An error occurred while deleting the course.", error: error.message });
    }
  };
  
const getAllCourses = async (req,res)=>{
    try {
        const allCourses = await Course.find({})
        .populate("departments", "name")
        if(!allCourses){return res.status(400).json({message: "Courses not found"})};

        return res.status(200).json({message: "Courses fetch successful", allCourses});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server error"});
    }
};

module.exports = {
    addCourse,
    getCourse,
    updateCourse,
    deleteCourse,
    getAllCourses
};
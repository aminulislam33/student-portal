const { error } = require("winston");
const Course = require("../models/Course");
const Department = require("../models/Department");
const Semester = require("../models/Semester");
const Subject = require("../models/Subject");

const addSubject = async (req, res) => {
  const {
    course,
    department,
    semester,
    subjectCode,
    subjectName,
    fullMarks,
    credits,
    type
  } = req.body;

  try {
    const existingSubject = await Subject.findOne({subjectCode});
    if (existingSubject) {
      return res.status(400).json({ message: "Subject already exists" });
    }

    const courseDetails = await Course.findOne({name: course});
    if(!courseDetails){
      return res.status(404).json({message: `Course ${course} not found`});
    }
    
    const departmentDetails = await Department.findOne({abbreviation: department});
    if(!departmentDetails){
      return res.status(404).json({message: `Department ${department} not found`});
    }
    
    const semesterDetails = await Semester.findOne({semesterNumber: semester});
    if(!semesterDetails){
      return res.status(404).json({message: `Semester ${semester} not found`});
    }

    const newSubject = new Subject({
      course: courseDetails._id,
      department: departmentDetails._id,
      semester: semesterDetails._id,
      subjectCode,
      subjectName,
      fullMarks,
      credits,
      type,
    });

    await newSubject.save();

    semesterDetails.subjects.addToSet(newSubject._id);
    await semesterDetails.save();

    return res.status(201).json({ message: "Subject added successfully", subject: newSubject });
  } catch (error) {
    console.error("Error adding subject:", error);
    return res.status(500).json({ message: "Error adding subject", error: error.message });
  }
};

const updateSubject = async (req,res) => {
  const {id} = req.params;
  const {
    course,
    department,
    semester,
    subjectCode,
    subjectName,
    fullMarks,
    credits,
    type
  } = req.body;

  try {
    const subjectDetails = await Subject.findById(id);
    if(!subjectDetails){
      console.error(error.message);
      return res.status(404).json({message: "Subject not found"});
    }

    let courseDetails;
    if(course){
      courseDetails = Course.findOne({name: course});
      if(!courseDetails){
      return res.status(404).json({message: `Course ${course} not found`});
      }
    }

    let departmentDetails;
    departmentDetails = Department.findOne({abbreviation: department});
    if(!departmentDetails){
      return res.status(404).json({message: `Department ${department} not found`});
    }

    let semesterDetails;
    semesterDetails = Semester.findOne({semesterNumber: semester});
    if(!semesterDetails){
      return res.status(404).json({message: `Semester ${semester} not found`});
    }

    const updatedFields = {
      ...(course && {course: courseDetails._id}),
      ...(department && {department: departmentDetails._id}),
      ...(semester && {semester: semesterDetails._id}),
      ...(subjectCode && {subjectCode}),
      ...(subjectName && {subjectName}),
      ...(fullMarks && {fullMarks}),
      ...(credits && {credits}),
      ...(type && {type}),
    };

    await Subject.findByIdAndUpdate(id, updatedFields, {new: true});
    return res.status(201).json({message: "Subject updated successfully"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Failed to update subject", error: error.message});
  }
};

const getAllSubjects = async (req,res)=>{
  try {
      const subjects = await Subject.find();
  
      if (subjects.length === 0) {
        return res.status(404).json({ message: "No subjects found" });
      }
  
      return res.status(200).json({ subjects });
    } catch (error) {
      console.error("Error fetching subjects:", error);
      return res.status(500).json({ message: "Error fetching subjects", error: error.message });
    }
};

const deleteSubject = async (req,res) => {
  const {id} = req.params;

  try {
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await Semester.updateMany(
      {subjects: id},
      {$pull: {subjects: id}}
    );

    await subject.deleteOne();

    return res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject: ", error.message);
    return res.status(500).json({ message: "Failed to delete subject", error: error.message });
  }
};

const getSubjectById = async (req,res) => {
  const {id} = req.params;

  try {
    const subject = await Subject.findById(id)
    .populate("course", "name")
    .populate("department", "abbreviation")
    .populate("semester", "semesterNumber")
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    return res.status(200).json({ subject });
  } catch (error) {
    console.error('Error fetching subject:', error);
    return res.status(500).json({ message: 'Failed to fetch subject', error: error.message });
  }
}

module.exports = {
  addSubject,
  updateSubject,
  deleteSubject,
  getSubjectById,
  getAllSubjects
};
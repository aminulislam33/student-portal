const Course = require("../models/Course");
const Department = require("../models/Department");
const Marks = require("../models/Marks");
const Semester = require("../models/Semester");
const Student = require("../models/Student");
const Subject = require("../models/Subject");

const addMarks = async (req, res) => {
  const {
    course,
    department,
    EnrollmentId,
    subjectCode,
    semester,
    midSemMarks,
    endSemMarks,
    internalAssessment
  } = req.body;
  
  try {
    const courseDetails = await Course.findOne({name: course});
    if(!courseDetails){
      return res.status(404).json({message: `Course ${course} not found`});
    }
    
    const departmentDetails = await Department.findOne({abbreviation: department});
    if(!departmentDetails){
      return res.status(404).json({message: `Department ${department} not found`});
    }
    
    const semesterDetails = await Semester.findOne({
      course: courseDetails._id,
      department: departmentDetails._id,
      semesterNumber: semester,
    });
    if(!semesterDetails){
      return res.status(404).json({message: `Semester ${semester} not found`});
    }
    
    const studentDetails = await Student.findOne({EnrollmentId});
    if(!studentDetails){
      return res.status(404).json({message: `Student ${EnrollmentId} not found`});
    }
    
    const subjectDetails = await Subject.findOne({subjectCode});
    if(!subjectDetails){
      return res.status(404).json({message: `Subject ${subjectCode} not found`});
    }

    const marksEntry = new Marks({
      course: courseDetails._id,
      department: departmentDetails._id,
      studentId: studentDetails._id,
      subjectId: subjectDetails._id,
      semester: semesterDetails._id,
      midSemMarks,
      endSemMarks,
      internalAssessment,
    });

    await marksEntry.save();
    return res.status(201).json({ message: "Marks added successfully", marks: marksEntry });

  } catch (error) {
    return res.status(500).json({ message: "Failed to add marks", error: error.message });
  }
};

const updateMarks = async (req, res) => {
  const {
    course,
    department,
    EnrollmentId,
    subjectCode,
    semester,
    midSemMarks,
    endSemMarks,
    internalAssessment
  } = req.body;

  try {
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
    
    const studentDetails = await Student.findOne({EnrollmentId});
    if(!studentDetails){
      return res.status(404).json({message: `Student ${EnrollmentId} not found`});
    }
    
    const subjectDetails = await Subject.findOne({subjectCode});
    if(!subjectDetails){
      return res.status(404).json({message: `Subject ${subjectCode} not found`});
    }

    const existMarks = await Marks.findOne({
      course: courseDetails._id,
      department: departmentDetails._id,
      studentId: studentDetails._id,
      subjectId: subjectDetails._id,
      semester: semesterDetails._id,
    });
    if (!existMarks) {
      return res.status(400).json({ message: `No marks found for this student ${EnrollmentId} and subject ${subjectCode}` });
    }

    const updateFields = {
      ...(midSemMarks && {midSemMarks}),
      ...(endSemMarks && {endSemMarks}),
      ...(internalAssessment && {internalAssessment}),
    }

    await Marks.findByIdAndUpdate(existMarks._id, updateFields, {new: true});

    return res.status(200).json({ message: "Marks updated successfully", marks: existMarks });
  } catch (error) {
    console.error("Error updating marks:", error);
    return res.status(500).json({ message: "Failed to update marks", error: error.message });
  }
};

const deleteMarks = async (req,res) =>{
  const {
    course,
    department,
    EnrollmentId,
    subjectCode,
    semester,
    midSemMarks,
    endSemMarks,
    internalAssessment
  } = req.body;

  try {
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
    
    const studentDetails = await Student.findOne({EnrollmentId});
    if(!studentDetails){
      return res.status(404).json({message: `Student ${EnrollmentId} not found`});
    }
    
    const subjectDetails = await Subject.findOne({subjectCode});
    if(!subjectDetails){
      return res.status(404).json({message: `Subject ${subjectCode} not found`});
    }

    const existMarks = await Marks.findOne({
      course: courseDetails._id,
      department: departmentDetails._id,
      studentId: studentDetails._id,
      subjectId: subjectDetails._id,
      semester: semesterDetails._id,
    });
    if (!existMarks) {
      return res.status(400).json({ message: `No marks found for the student ${EnrollmentId} and subject ${subjectCode}` });
    }

    const updatedFields = {
      ...(midSemMarks !== undefined && { midSemMarks: null }),
      ...(endSemMarks !== undefined && { endSemMarks: null }),
      ...(internalAssessment !== undefined && { internalAssessment: null }),
    };

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to reset" });
    }

    await Marks.updateOne(
      { _id: existMarks._id },
      { $set: updatedFields }
    );

    return res.status(200).json({
      message: `Marks deleted successfully for student ${EnrollmentId} in subject ${subjectCode}`,
    });

  } catch (error) {
    console.error("Error resetting marks:", error.message);
    return res.status(500).json({message: "Failed to reset marks",error: error.message});
  }
}

const getMarksOfStudent = async (req, res) => {
  const {
    course,
    department,
    EnrollmentId,
    subjectCode,
    semester,
  } = req.body;

  try {
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
    
    const studentDetails = await Student.findOne({EnrollmentId});
    if(!studentDetails){
      return res.status(404).json({message: `Student ${EnrollmentId} not found`});
    }
    
    const subjectDetails = await Subject.findOne({subjectCode});
    if(!subjectDetails){
      return res.status(404).json({message: `Subject ${subjectCode} not found`});
    }

    const marks = await Marks.findOne({
      course: courseDetails._id,
      department: departmentDetails._id,
      studentId: studentDetails._id,
      subjectId: subjectDetails._id,
      semester: semesterDetails._id,
    })
    .populate("course", "name")
    .populate("department", "name")
    .populate("semester", "semesterNumber")
    .populate({
      path: 'studentId',
      select: 'DBid EnrollmentId',
      populate: {
        path: 'DBid',
        select: 'fullName email gender photo'
      }
    })
    .populate("subjectId", "subjectName subjectCode")
    if (!marks) {
      return res.status(400).json({ message: `No marks found for the student ${EnrollmentId} and subject ${subjectCode}` });
    }

    return res.status(200).json({ message: "Marks fetched successfully", marks: marks });
  } catch (error) {
    console.error("Error fetching marks:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addMarks,
  updateMarks,
  deleteMarks,
  getMarksOfStudent
};
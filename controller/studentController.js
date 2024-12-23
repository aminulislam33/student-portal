const nodemailer = require('nodemailer');
const Course = require("../models/Course");
const Department = require("../models/Department");
const Semester = require("../models/Semester");
const Student = require("../models/Student");
const User = require("../models/User");
const addUser = require("../utils/addUser");
const generateOTP = require("../utils/otpGenerator");

const addStudent = async (req, res) => {
  const {
    fullName,
    email,
    phone,
    gender,
    EnrollmentId,
    course,
    yearOfAdmission,
    department,
    currentSemester,
  } = req.body;

  try {
    const user = await addUser(fullName, email, phone, gender);
    const userId = user?._id || user;

    const existingStudent = await Student.findOne({ EnrollmentId });
    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Student already exists with the Enrollment ID" });
    }

    const departmentDetails = await Department.findOne({abbreviation: department});
    if(!departmentDetails){
      return res.status(404).json({ message: `Department with abbreviation '${department}' not found` });
    }
    
    const courseDetails = await Course.findOne({name: course});
    if(!courseDetails){
      return res.status(404).json({ message: `Course '${course}' not found` });
    }
    
    const semesterDetails = await Semester.findOne({
      semesterNumber: currentSemester,
      department: departmentDetails._id,
      course: courseDetails._id,
    });
    if(!semesterDetails){
      return res.status(404).json({ message: `semesterNumber '${currentSemester}' not found for ${department} for ${course}` });
    }

    const newStudent = new Student({
      DBid: userId,
      EnrollmentId,
      course: courseDetails._id,
      yearOfAdmission,
      department: departmentDetails._id,
      currentSemester: semesterDetails._id,
    });

    await newStudent.save();

      semesterDetails.students.addToSet(newStudent._id);
      await semesterDetails.save();

    return res.status(201).json({ message: "Student registration successful", student: newStudent });
  } catch (error) {
    console.error("Error in addStudent: ", error.message);
    return res.status(500).json({ message: "Failed to register student", error: error.message });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    fullName,
    email,
    phone,
    gender,
    EnrollmentId,
    course,
    yearOfAdmission,
    department,
    currentSemester,
  } = req.body;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    let departmentDoc;
    if(department){
      departmentDoc = await Department.findOne({ abbreviation: department });
      if (!departmentDoc) {
        return res.status(404).json({ message: `Department '${department}' not found` });
      }
    }

    let courseDetails;
    if(course){
      courseDetails = await Course.findOne({name: course});
      if(!courseDetails){
        return res.status(404).json({ message: `Course '${course}' not found` });
      }
    }

    let semesterDetails;
    if(currentSemester){
      semesterDetails = await Semester.findOne({
      semesterNumber: currentSemester,
        department: departmentDoc._id,
        course: courseDetails._id,
    });
    if(!semesterDetails){
      return res.status(404).json({ message: `Semester '${currentSemester}' not found` });
    }
  }

    const updatedFields = {
      ...(fullName && { fullName }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(gender && { gender }),
      ...(EnrollmentId && { EnrollmentId }),
      ...(course && { course: courseDetails._id }),
      ...(yearOfAdmission && { yearOfAdmission }),
      ...(department && { department: departmentDoc._id }),
      ...(currentSemester && { currentSemester: semesterDetails._id }),
    };

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );

    const updatedUser = await User.findByIdAndUpdate(
      updatedStudent.DBid,
      updatedFields,
      {new: true}
    );

    if (currentSemester && currentSemester !== student.currentSemester) {
      await Semester.updateMany(
        { students: id },
        { $pull: { students: id } }
      );
      semesterDetails.students.addToSet(id);
      await semesterDetails.save();
    }

    return res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
  } catch (error) {
    console.error("Error updating student: ", error.message);
    return res.status(500).json({ message: "Failed to update student", error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await Semester.updateMany(
      { students: id },
      { $pull: { students: id } }
    );

    await student.deleteOne();

    return res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student: ", error.message);
    return res.status(500).json({ message: "Failed to delete student", error: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const allstudents = await Student.find({})
    .populate({
      path: "DBid",
      select: "fullName email phone gender photo",
    })
    .populate("course", "name")
    .populate("department", "name")
    .populate("currentSemester", "semesterNumber")
    if (!allstudents) { return res.status(400).json({ message: "Students not found" }) };

    return res.status(200).json({ message: "Students fetch successful", students: allstudents });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getStudentDetails = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    console.log(user);
    const student = await Student.findOne({DBid: user._id})
      .populate({
        path: "DBid",
        select: "fullName email phone gender photo",
      })
      .populate("department", "name abbreviation")
      .populate("currentSemester", "semesterNumber");

    if (!student || !user) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student details:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching student details" });
  }
};

module.exports = {
  addStudent,
  updateStudent,
  deleteStudent,
  getAllStudents,
  getStudentDetails
};
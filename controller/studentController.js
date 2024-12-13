const Marks = require("../models/Marks");
const Student = require("../models/Student");
const addUser = require("../utils/addUser");
const calculateSGPA = require("../utils/calculateSGPA");

const addStudent = async (req, res) => {
  const { fullName, email, phone, gender, password, EnrollmentId, program, yearOfAdmission, department, currentSemester } = req.body;

  try {
    const user = await addUser(fullName, email, phone, gender, password);
    const userId = user?._id || user;

    const userGet = await Student.findOne({ EnrollmentId: EnrollmentId });
    if (!userGet) {
      const newStudent = new Student({
        DBid: userId,
        EnrollmentId,
        program,
        yearOfAdmission,
        department,
        currentSemester,
      });
    }
    else{
      return res.status(404).json({message:'USER NOT FOUND'});
    }


    await newStudent.save();

    return res.status(201).json({ message: "Student Registration Successful" });
  } catch (error) {
    console.error("Error in addStudent: ", error.message);

    if (error.message === "User email already exists") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Failed to Register", error: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const allstudents = await Student.find({});
    if (!allstudents) { return res.status(400).json({ message: "Students not found" }) };

    return res.status(200).json({ message: "Students fetch successful", students: allstudents });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getStudentDetails = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId)
      .populate({
        path: "DBid",
        select: "fullName email phone gender photo role",
      })
      .populate("department", "name abbreviation")
      .populate("currentSemester", "semesterNumber subjects");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("information: ", student.currentSemester.subjects)
    const sgpa = await calculateSGPA(studentId, student.currentSemester.subjects);
    console.log("SGPA: ", sgpa)

    const studentDetails = {
      fullName: student.DBid.fullName,
      email: student.DBid.email,
      phone: student.DBid.phone,
      gender: student.DBid.gender,
      photo: student.DBid.photo,
      role: student.DBid.role,
      enrollmentId: student.EnrollmentId,
      program: student.program,
      yearOfAdmission: student.yearOfAdmission,
      department: student.department,
      currentSemester: student.currentSemester,
      SGPA: sgpa,
    };

    return res.status(200).json(studentDetails);
  } catch (error) {
    console.error("Error fetching student details:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching student details" });
  }
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudentDetails
};
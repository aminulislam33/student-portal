const Course = require("../models/Course");
const Department = require("../models/Department");
const Semester = require("../models/Semester");
const Student = require("../models/Student");
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

    const updatedFields = {
      ...(fullName && { fullName }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(gender && { gender }),
      ...(EnrollmentId && { EnrollmentId }),
      ...(course && { course: courseDetails._id }),
      ...(yearOfAdmission && { yearOfAdmission }),
      ...(department && { department: departmentDoc._id }),
      ...(currentSemester && { currentSemester }),
    };

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );

    if (department && department !== student.department) {
      await Department.updateMany(
        { students: id },
        { $pull: { students: id } }
      );
      const newDept = await Department.findOne({ abbreviation: department });
      newDept.students.addToSet(id);
      await newDept.save();
    }

    if (currentSemester && currentSemester !== student.currentSemester) {
      await Semester.updateMany(
        { students: id },
        { $pull: { students: id } }
      );
      const newSemester = await Semester.findOne({
        semesterNumber: currentSemester,
        department,
      });
      newSemester.students.addToSet(id);
      await newSemester.save();
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

    await Department.updateMany(
      { students: id },
      { $pull: { students: id } }
    );

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

const initiateAccountSetup = async (req, res) => {
  const { EnrollmentId } = req.body;

  try {
      const student = await Student.findOne({ EnrollmentId });
      if (!student) {
          return res.status(404).json({ message: 'Student not found' });
      }

      const otp = generateOTP();
      student.otp = otp;
      student.otpExpires = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes
      await student.save();

      const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
          },
      });

      await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: 'OTP for Account Setup',
          text: `Your OTP is: ${otp}`,
      });

      res.status(200).json({ message: 'OTP sent to your institute email.' });
  } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ message: 'Error sending OTP' });
  }
};

const verifyOtp = async (req, res) => {
  const { EnrollmentId, otp } = req.body;

  try {
      const student = await Student.findOne({ EnrollmentId });

      if (!student || student.otpExpires < Date.now()) {
          return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      if (student.otp !== otp) {
          return res.status(400).json({ message: 'Incorrect OTP' });
      }

      res.status(200).json({message: 'OTP verified successfully'});
  } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ message: 'Error verifying OTP' });
  }
};

const createPassword = async (req, res) => {
    const { EnrollmentId, password } = req.body;

    try {
        const student = await Student.findOne({ EnrollmentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.password = password;

        student.otp = undefined;
        student.otpExpires = undefined;

        await student.save();

        res.status(200).json({ message: 'Password created successfully!' });
    } catch (error) {
        console.error('Error creating password:', error);
        res.status(500).json({ message: 'Error creating password' });
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
      .populate("currentSemester", "semesterNumber");

    if (!student) {
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
  initiateAccountSetup,
  verifyOtp,
  createPassword,
  getAllStudents,
  getStudentDetails
};
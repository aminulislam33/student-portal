const Student = require("../models/Student");
const addUser = require("../utils/addUser");
const generateOTP = require("../utils/otpGenerator");

const addStudent = async (req, res) => {
  const { fullName, email, phone, gender, password, EnrollmentId, program, yearOfAdmission, department, currentSemester } = req.body;

  try {
    const user = await addUser(fullName, email, phone, gender, password);
    const userId = user?._id || user;

    const userGet = await Student.findOne({ EnrollmentId: EnrollmentId });
    if (userGet) {return res.status(404).json({message: "Student already exist with the Enrollment ID"})};

      const newStudent = new Student({
        DBid: userId,
        EnrollmentId,
        program,
        yearOfAdmission,
        department,
        currentSemester,
      });

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

        student.password = hashedPassword;

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
  initiateAccountSetup,
  verifyOtp,
  createPassword,
  getAllStudents,
  getStudentDetails
};
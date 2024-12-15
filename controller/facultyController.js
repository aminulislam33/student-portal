const nodemailer = require('nodemailer');
const Department = require("../models/Department");
const Faculty = require("../models/Faculty");
const addUser = require("../utils/addUser");
const generateOTP = require("../utils/otpGenerator");

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

const initiateAccountSetup = async (req, res) => {
  const { employeeID } = req.body;

  try {
      const faculty = await Faculty.findOne({ employeeID }).populate("DBid", "email");
      if (!faculty) {
          return res.status(404).json({ message: 'Faculty not found' });
      }

      const otp = generateOTP();
      faculty.otp = otp;
      faculty.otpExpires = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes
      await faculty.save();

      const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
          },
      });

      await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: faculty.DBid.email,
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
  const { employeeID, otp } = req.body;

  try {
      const faculty = await Faculty.findOne({ employeeID });

      if (!faculty || faculty.otpExpires < Date.now()) {
          return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      if (faculty.otp !== otp) {
          return res.status(400).json({ message: 'Incorrect OTP' });
      }

      res.status(200).json({message: 'OTP verified successfully'});
  } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ message: 'Error verifying OTP' });
  }
};

const createPassword = async (req, res) => {
    const { employeeID, password } = req.body;

    try {
        const faculty = await Faculty.findOne({ employeeID }).populate("DBid", "password");
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        faculty.DBid.password = password;
        await faculty.DBid.save();

        faculty.otp = undefined;
        faculty.otpExpires = undefined;

        await faculty.save();

        res.status(200).json({ message: 'Password created successfully!' });
    } catch (error) {
        console.error('Error creating password:', error);
        res.status(500).json({ message: 'Error creating password' });
    }
};

module.exports = {
  addFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyById,
  getAllFaculties,
  initiateAccountSetup,
  verifyOtp,
  createPassword,
};
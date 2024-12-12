const Marks = require("../models/Marks");
const Student = require("../models/Student");
const addUser = require("../utils/addUser");

const addStudent = async (req, res) => {
    const { fullName, email, phone, gender, password, studentID, program, yearOfAdmission, department } = req.body;

    try {
        const user = await addUser(fullName, email, phone, gender, password);
        console.log("User returned by utils: ", user);

        const newStudent = new Student({
            DBid: user._id,
            studentID,
            program,
            yearOfAdmission,
            department,
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

const getStudentDetails = async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await Student.findOne({ DBid: studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const marks = await Marks.find({ studentId: studentId });
        if(!marks){
            return res.status(404).json({message: "Marks not found"})
        };

        const studentDetails = {
            ...student.toObject(),
            marks,
        };

        res.status(200).json(studentDetails);
    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).json({ message: 'An error occurred while fetching student details' });
    }
};

module.exports = {
    addStudent,
    getStudentDetails
};
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

module.exports = addStudent;
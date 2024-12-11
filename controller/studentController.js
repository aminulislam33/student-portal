const Student = require("../model/Student");
const addUser = require("../utils/addUser")

const addStudent = async (req,res) =>{
    const {studentID, program, yearOfAdmission, department} = req.body;

    try {
        const user = await addUser();

        const newStudent = new Student({
            DBid: user._id,
            studentID,
            program,
            yearOfAdmission,
            department,
        });

        await newStudent.save();

        return res.status(201).json({message: "Student Registration Successful"});
    } catch (error) {
        return res.status(500).json({message: "Failed to Register"});
    }
};

module.exports = addStudent;
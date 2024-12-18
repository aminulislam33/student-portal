const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require("../models/Student");

const userLogin = async (req,res)=>{
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user){return res.status(404).json({message: "User not found"})};

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){return res.status(404).json({message: "Invalid credentials"})};

        const payload = {id: user._id, role: user.role};
        const token = jwt.sign({payload}, process.env.JWT_SECRET, {expiresIn: '1h'});

        return res.status(200).json({message: "Login successful", token});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Login failed due to server error", error: error.message});
    }
};

const studentLogin = async (req,res)=>{
    const {EnrollmentId,  password} = req.body;

    try {
        const student = await Student.findOne({EnrollmentId});
        const user = await User.findById(student.DBid);
        if(!student || !user){return res.status(404).json({message: "Student not found"})};
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){return res.status(404).json({message: "Invalid credentials"})};

        const payload = {id: user._id, role: user.role};
        const token = jwt.sign({payload}, process.env.JWT_SECRET, {expiresIn: '1h'});

        return res.status(200).json({message: "Login successful", token});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Login failed due to server error", error: error.message});
    }
};

module.exports = {
    userLogin,
    studentLogin,
};
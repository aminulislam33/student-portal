const User = require("../models/User");
const addUser = require("../utils/addUser");

const registerAdmin = async (req,res)=>{
    const {fullName, email, phone, gender, password} = req.body;
    try {
        const admin = await addUser(fullName, email, phone, gender, password);
        if(!admin){return res.status(404).json({message: "Admin Not Registered due to unknown reason"})};
        return res.status(201).json({message: "Admin Registration successful"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server error"});
    };
};

const getAllUsers = async (req,res)=>{
    try {
        const users = await User.find({});
        if(!users){return res.status(400).json({message: "Users not found"})};
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server error"});
    }
};

module.exports = {
    registerAdmin,
    getAllUsers
}
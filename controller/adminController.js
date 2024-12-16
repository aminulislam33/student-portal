const User = require("../models/User");
const addUser = require("../utils/addUser");

const registerAdmin = async (req,res)=>{
    const {fullName, email, phone, gender, password} = req.body;
    try {
        const admin = await addUser(fullName, email, phone, gender);
        if(!admin){return res.status(404).json({message: "Admin Not Registered due to unknown reason"})};
        const user = await User.findById(admin._id);
        user.password = password;
        await user.save();
        return res.status(201).json({message: "Admin Registration successful"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server error"});
    };
};

module.exports = {
    registerAdmin,
}
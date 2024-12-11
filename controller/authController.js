const User = require("../model/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req,res)=>{
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
        
    }
};

module.exports = login;
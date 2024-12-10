const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../model/User");

const signup = async (req,res)=>{
    const {email,passowrd} = req.body;

    try {
        const existUser = await User.findOne({email});
        if(existUser){
            return res.status(400).json({message: "User email alrteady exist"});
        }

        const newUser = new User({email,passowrd});
        await newUser.save();
        return res.status(201).json({message: "User registered successfully"});
    } catch (error) {
        return res.status(500).json({message: "Failed to register user"});
    }
}

const login = async (req,res)=>{
    const {email, passowrd} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const isMatch = await bcrypt.compare(passowrd, user.password);
        if(!isMatch){return res.status(400).json({message: "Invalid credentials"})};

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
        return res.status(201).json({message: "Login successful"}, token);
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

const passwordReset = async (req,res)=>{
    const {oldPassword, newPassword} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user){return res.status(404).json({message: "User not found"})};

        const isMatch = bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {return res.status(400).json({ message: "Old password is incorrect" })};
        if(isMatch){
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Password Reset failed!" });
    }
};

module.exports = {
    signup,
    login,
    passwordReset
}
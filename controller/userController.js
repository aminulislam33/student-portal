const User = require("../model/User");

const getProfile = async(req,res)=>{
    try {
        const user = await User.findById(req.userId).select('-password');
        if(!user){return res.status(404).json({message: "User not found"})};

        return res.status(201).json(user);
    } catch (error) {
        
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
    getProfile,
    passwordReset
}
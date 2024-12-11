const User = require("../model/User");

const getProfile = async(req,res)=>{
    try {
        const user = await User.findById(req.userId).select('-password');
        if(!user){return res.status(404).json({message: "User not found"})};

        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

const updateProfile = async (req, res) => {
  const { fullName, phone, photo } = req.body;
  const userId = req.userId;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullName, phone, photo },
        { new: true, runValidators: true }
      ).select('-password');
  
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });
      res.status(200).json({message: "Profile updated successfully", updatedUser});
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    console.log("oldPassword: ", oldPassword)
    console.log("newPassword: ", newPassword)
    console.log("userId: ", userId)
    console.log("user: ", user)

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


module.exports = {
    getProfile,
    updateProfile,
    changePassword
}
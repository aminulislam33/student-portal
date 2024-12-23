const User = require("../models/User");

const addUser = async (fullName, email, phone, gender ) => {
    try {
        const existUser = await User.findOne({ email });
        if (existUser) {
            return existUser._id;
        }

        const newUser = new User({
            fullName,
            email,
            phone,
            gender,
        });

        await newUser.save();
        return newUser;
    } catch (error) {
        console.error("Error in addUser: ", error.message);
        throw error; 
    }
};

module.exports = addUser;
const User = require("../models/User");

const addUser = async (fullName, email, phone, gender, password) => {
    try {
        const existUser = await User.findOne({ email });
        if (existUser) {
            throw new Error("User email already exists");
        }

        const newUser = new User({
            fullName,
            email,
            phone,
            gender,
            password,
        });

        await newUser.save();
        return newUser;
    } catch (error) {
        console.error("Error in addUser: ", error.message);
        throw error; 
    }
};

module.exports = addUser;
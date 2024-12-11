const User = require("../model/User");

const addUser = async (fullName, email, phone, photo, gender, password)=>{
    try {
        const existUser = await User.findOne({email});
        if(existUser){
            return res.status(400).json({message: "User email alrteady exist"});
        }

        const newUser = new User({
            fullName,
            email,
            phone,
            photo,
            gender,
            password
        });
        
        await newUser.save();
        return res.status(201).json({message: "User registered successfully", newUser});
    } catch (error) {
        return res.status(500).json({message: "Failed to register user"});
    }
};

module.exports = addUser;
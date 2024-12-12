const Course = require("../../models/Course");

const addCourse = async (req, res) => {
    const { name, type, duration, totalCredits, departments } = req.body;

    try {
        const existingCourse = await Course.findOne({ name });
        if (existingCourse) {
            return res.status(400).json({ message: "Course with this name already exists." });
        }

        const newCourse = new Course({
            name,
            type,
            duration,
            totalCredits,
            departments,
        });

        await newCourse.save();

        res.status(201).json({ message: "Course added successfully!", course: newCourse });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ message: "An error occurred while adding the course." });
    }
};

const getAllCourses = async (req,res)=>{
    try {
        const allCourses = await Course.find({});
        if(!allCourses){return res.status(400).json({message: "Courses not found"})};

        return res.status(200).json({message: "Courses fetch successful", allCourses});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server error"});
    }
};

module.exports = {
    addCourse,
    getAllCourses
};
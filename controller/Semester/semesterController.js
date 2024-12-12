const Semester = require("../../models/Semester");

const addSemester = async (req,res)=>{
    const {semesterNumber, department, subjects, totalCredits, totalMarks, students } = req.body;

    try {
        const exitingSemester = await Semester.findOne({semesterNumber, department});
        if(exitingSemester){return res.status(404).json({message: `Semester already exist with semester no. ${semesterNumber} of ${department} department`})};

        const newSemester = new Semester({
            semesterNumber,
            department,
            subjects,
            totalCredits,
            totalMarks,
            students
        });

        await newSemester.save();

        return res.status(201).json({message: "Semester added successfully", semester: newSemester});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to add semester', error: error.message });
    }
};

const getAllSemesters = async (req,res)=>{
    try {
        const allSemesters = await Semester.find({});
        if(!allSemesters){return res.status(400).json({message: "Semesters not found"})};

        return res.status(200).json({message: "Semester fetch successful", semesters: allSemesters});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch semester', error: error.message });
    }
}

module.exports = {
    addSemester,
    getAllSemesters
}
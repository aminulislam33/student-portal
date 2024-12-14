const xlsx = require('xlsx');
const Department = require('../../models/Department');
const Course = require('../../models/Course');
const Semester = require('../../models/Semester');
const Subject = require('../../models/Subject');

const bulkEntryOfSubjects = async (req, res) => {
    const file = req.file;

    try {
        const workbook = xlsx.readFile(file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        for (const subject of data) {
            const {
                course,
                department,
                semester,
                subjectCode,
                subjectName,
                fullMarks,
                credits,
                type
            } = subject;

            const courseDetails = await Course.findOne({name: course});
            if(!courseDetails){
                console.warn(`Course "${course}" not found for Subject: ${subjectCode}`);
                continue;
            };

            const departmentDetails = await Department.findOne({ name: department });
            if (!departmentDetails) {
                console.warn(`Department "${department}" not found for Subject: ${subjectCode}`);
                continue;
            };

            const semesterDetails = await Semester.findOne({
                semesterNumber: semester,
                department: departmentDetails._id,
                course: courseDetails._id,
            });
            if(!semesterDetails){
                console.warn(`Semester "${semester}" not found for Subject: ${subjectCode}`);
                continue;
            };

            const newSemester = new Subject({
                course: courseDetails._id,
                department: departmentDetails._id,
                semester: semesterDetails._id,
                subjectCode,
                subjectName,
                fullMarks,
                credits,
                type,
            });
        
            await newSemester.save();
        }

        res.status(201).json({ message: 'Bulk entry successful!' });
    } catch (error) {
        console.error('Error processing bulk entry:', error);
        res.status(500).json({ message: 'Error processing bulk entry' });
    }
};

module.exports = { bulkEntryOfSubjects };
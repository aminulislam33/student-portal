const xlsx = require('xlsx');
const Student = require('../../models/Student');
const Department = require('../../models/Department');
const Course = require('../../models/Course');
const Semester = require('../../models/Semester');
const Marks = require('../../models/Marks');
const Subject = require('../../models/Subject');

const bulkEntryOfMarks = async (req, res) => {
    const file = req.file;

    try {
        const workbook = xlsx.readFile(file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        for (const marks of data) {
            const {
                course,
                department,
                EnrollmentId,
                subjectCode,
                semester,
                midSemMarks,
                endSemMarks,
                internalAssessment
            } = marks;

            const departmentDetails = await Department.findOne({ name: department });
            if (!departmentDetails) {
                console.warn(`Department "${department}" not found for student: ${EnrollmentId}`);
                continue;
            };

            const courseDetails = await Course.find({name: course});
            if (!courseDetails) {
                console.warn(`Course "${course}" not found for student: ${EnrollmentId}`);
                continue;
            };

            const semesterDetails = await Semester.findOne({
                course: courseDetails._id,
                department: departmentDetails._id,
                semesterNumber: semester,
            });
            if (!semesterDetails) {
                console.warn(
                    `Semester "${semester}" not found for department: ${department} for student: ${EnrollmentId}`
                );
                continue;
            };

            const studentsDetails = await Student.findOne({EnrollmentId});
            if (!studentsDetails){
                console.warn(`Student not found for Enrollment Number: ${EnrollmentId}`);
                continue;
            };

            const subjectDetails = await Subject.findOne({subjectCode});
            if (!subjectDetails) {
                console.warn(`Subject "${subjectCode}" not found for student: ${EnrollmentId}`);
                continue;
            };

            const newMarks = new Marks({
                course: courseDetails._id,
                department: departmentDetails._id,
                studentId: studentsDetails._id,
                subjectId: subjectDetails._id,
                semester: semesterDetails._id,
                midSemMarks,
                endSemMarks,
                internalAssessment
              });
        
            await newMarks.save();
        }

        res.status(201).json({ message: 'Bulk entry successful!' });
    } catch (error) {
        console.error('Error processing bulk entry:', error);
        res.status(500).json({ message: 'Error processing bulk entry' });
    }
};

module.exports = { bulkEntryOfMarks };
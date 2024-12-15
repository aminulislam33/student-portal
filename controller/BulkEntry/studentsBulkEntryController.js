const xlsx = require('xlsx');
const Student = require('../../models/Student');
const addUser = require('../../utils/addUser');
const Department = require('../../models/Department');
const Course = require('../../models/Course');
const Semester = require('../../models/Semester');

const bulkEntryOfStudents = async (req, res) => {
    const file = req.file;

    try {
        const workbook = xlsx.readFile(file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        for (const student of data) {
            const {fullName, email, gender, EnrollmentId, course, yearOfAdmission, department, currentSemester} = student;

            const user = await addUser(fullName, email, gender);
            if(!user){
                console.warn(`User creation failed for the student: ${EnrollmentId}`);
                continue;
            };
            const userId = user?._id || user;

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
                semesterNumber: currentSemester,
                department: departmentDetails._id,
            });
            if (!semesterDetails) {
                console.warn(
                    `Semester "${student.currentSemester}" not found for department: ${student.department} for student: ${EnrollmentId}`
                );
                continue;
            };

            const existStudent = await Student.findOne({ EnrollmentId: EnrollmentId });
            if (existStudent) {
                console.warn(`Student already exist with the Enrollment ID: ${EnrollmentId}`);
                continue;
            };

            const newStudent = new Student({
                DBid: userId,
                EnrollmentId,
                course,
                yearOfAdmission,
                department: departmentDetails._id,
                currentSemester: semesterDetails._id,
              });
        
            await newStudent.save();
            
            semesterDetails.students.addToSet(newStudent._id);
            await semesterDetails.save();
        }

        res.status(201).json({ message: 'Bulk entry successful!' });
    } catch (error) {
        console.error('Error processing bulk entry:', error);
        res.status(500).json({ message: 'Error processing bulk entry' });
    }
};

module.exports = { bulkEntryOfStudents };
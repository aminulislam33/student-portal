const xlsx = require('xlsx');
const Department = require('../../models/Department');
const Course = require('../../models/Course');
const Semester = require('../../models/Semester');
const Subject = require('../../models/Subject');
const Student = require('../../models/Student');

const bulkEntryOfSemesters = async (req, res) => {
    const file = req.file;

    try {
        const workbook = xlsx.readFile(file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        for (const semester of data) {
            const {
                semesterNumber,
                year,
                department,
                course,
                startDate,
                endDate,
                subjects,
                totalCredits,
                totalMarks,
                students,
            } = semester;

            const departmentDetails = await Department.findOne({ name: department });
            if (!departmentDetails) {
                console.warn(`Department "${department}" not found for semester: ${semesterNumber}`);
                continue;
            }

            const courseDetails = await Course.findOne({ name: course });
            if (!courseDetails) {
                console.warn(`Course "${course}" not found for semester: ${semesterNumber}`);
                continue;
            }

            const parsedSubjects = JSON.parse(subjects || '[]');
            const subjectIds = [];
            for (const subjectCode of parsedSubjects) {
                const subject = await Subject.findOne({ subjectCode });
                if (!subject) {
                    console.warn(`Subject with code "${subjectCode}" not found for semester: ${semesterNumber}`);
                    continue;
                }
                subjectIds.push(subject._id);
            }

            const parsedStudents = JSON.parse(students || '[]');
            const studentIds = [];
            for (const EnrollmentId of parsedStudents) {
                const student = await Student.findById({EnrollmentId});
                if (!student) {
                    console.warn(`Student with ID "${EnrollmentId}" not found for semester: ${semesterNumber}`);
                    continue;
                }
                studentIds.push(student._id);
            }

            const existingSemester = await Semester.findOne({
                semesterNumber,
                department: departmentDetails._id,
                course: courseDetails._id,
                year,
            });

            if (existingSemester) {
                console.warn(
                    `Semester "${semesterNumber}" already exists for department: ${department} and course: ${course} in year ${year}`
                );
                continue;
            }

            const newSemester = new Semester({
                semesterNumber,
                year,
                department: departmentDetails._id,
                course: courseDetails._id,
                startDate,
                endDate,
                subjects: subjectIds,
                totalCredits,
                totalMarks,
                students: studentIds,
            });

            await newSemester.save();
        }

        res.status(201).json({ message: 'Bulk entry successful!' });
    } catch (error) {
        console.error('Error processing bulk entry:', error);
        res.status(500).json({ message: 'Error processing bulk entry' });
    }
};

module.exports = { bulkEntryOfSemesters };
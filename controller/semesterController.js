const Course = require("../models/Course");
const Department = require("../models/Department");
const Semester = require("../models/Semester");
const Student = require("../models/Student");
const Subject = require("../models/Subject");

const addSemester = async (req, res) => {
    const { semesterNumber, year, department, course, subjects, startDate, endDate, totalCredits, totalMarks, students } = req.body;
  
    try {
        const departmentDoc = await Department.findOne({ abbreviation: department });
      if (!departmentDoc) {
        return res.status(404).json({ message: `Department '${department}' not found` });
      }
      
      const existingSemester = await Semester.findOne({ semesterNumber, department: departmentDoc._id });
      if (existingSemester) {
        return res.status(400).json({
          message: `Semester ${semesterNumber} already exists in department ${department}`,
        });
      }

      const courseDetails = await Course.findOne({name: course});
      if(!courseDetails){
        return res.status(404).json({ message: `Course '${course}' not found` });
      }

      const missingSubjects = [];
      let subjectIDs = [];
      
      if(subjects){
        for (const subject of subjects) {
            const subjectDetails = await Subject.findOne({ subjectCode: subject });
          if (!subjectDetails) {
            missingSubjects.push(subject);
            continue;
          }
          subjectIDs.push(subjectDetails._id);
        }
        
        if (missingSubjects.length > 0) {
          console.warn(`The following subjects were not found: ${missingSubjects.join(", ")}`);
        }
      }

    const missingStudents = [];
      let studentIDs = [];
      
      if(students){
        for (const student of students) {
            const studentDetails = await Student.findOne({ EnrollmentId: student });
          if (!studentDetails) {
            missingStudents.push(student);
            continue;
          }
          studentIDs.push(studentDetails._id);
        }
        
        if (missingStudents.length > 0) {
          console.warn(`The following students were not found: ${missingStudents.join(", ")}`);
        }
      }
  
      const newSemester = new Semester({
        semesterNumber,
        year,
        department: departmentDoc._id,
        course: courseDetails._id,
        subjects: subjectIDs,
        startDate,
        endDate,
        totalCredits,
        totalMarks,
        students: studentIDs,
      });
  
      await newSemester.save();
  
      return res.status(201).json({ message: 'Semester added successfully', semester: newSemester });
    } catch (error) {
      console.error('Error adding semester:', error);
      return res.status(500).json({ message: 'Failed to add semester', error: error.message });
    }
  };

  const updateSemester = async (req, res) => {
    const { id } = req.params;
    const { semesterNumber, department, subjects, totalCredits, totalMarks, students } = req.body;
  
    try {
      const semester = await Semester.findById(id);
      if (!semester) {
        return res.status(404).json({ message: 'Semester not found' });
      }

      const departmentDoc = await Department.findOne({ abbreviation: department });
      if (!departmentDoc) {
        return res.status(404).json({ message: `Department '${department}' not found` });
      }

      const missingSubjects = [];
      let subjectIDs = [];
      
      if(subjects){
        for (const subject of subjects) {
            const subjectDetails = await Subject.findOne({ subjectCode: subject });
          if (!subjectDetails) {
            missingSubjects.push(subject);
            continue;
          }
          subjectIDs.push(subjectDetails._id);
        }
        
        if (missingSubjects.length > 0) {
          console.warn(`The following subjects were not found: ${missingSubjects.join(", ")}`);
        }
      }

      const missingStudents = [];
      let studentIDs = [];
      
      if(students){
        for (const student of students) {
            const studentDetails = await Student.findOne({ EnrollmentId: student });
          if (!studentDetails) {
            missingStudents.push(student);
            continue;
          }
          studentIDs.push(studentDetails._id);
        }
        
        if (missingStudents.length > 0) {
          console.warn(`The following students were not found: ${missingStudents.join(", ")}`);
        }
      }
  
      const updatedFields = {
        ...(semesterNumber && { semesterNumber }),
        ...(department && { department: departmentDoc._id }),
        ...(subjects && { subjects: subjectIDs }),
        ...(totalCredits && { totalCredits }),
        ...(totalMarks && { totalMarks }),
        ...(students && { students: studentIDs }),
      };
  
      if (subjects) {
        await Subject.updateMany(
          { semester: id },
          { $pull: { semester: id } }
        );
        await Subject.updateMany(
          { _id: { $in: subjects } },
          { $addToSet: { semester: id } }
        );
      }
  
      if (students) {
        await Student.updateMany(
          { semesters: id },
          { $pull: { semesters: id } }
        );
        await Student.updateMany(
          { _id: { $in: students } },
          { $addToSet: { semesters: id } }
        );
      }
  
      const updatedSemester = await Semester.findByIdAndUpdate(id, updatedFields, { new: true });
  
      return res.status(200).json({ message: 'Semester updated successfully', semester: updatedSemester });
    } catch (error) {
      console.error('Error updating semester:', error);
      return res.status(500).json({ message: 'Failed to update semester', error: error.message });
    }
  };

  const deleteSemester = async (req, res) => {
    const { id } = req.params;
  
    try {
      const semester = await Semester.findById(id);
      if (!semester) {
        return res.status(404).json({ message: 'Semester not found' });
      }
  
      await Student.updateMany(
        { semesters: id },
        { $pull: { semesters: id } }
      );
  
      await Subject.updateMany(
        { semester: id },
        { $unset: { semester: '' } }
      );
  
      await semester.deleteOne();
  
      return res.status(200).json({ message: 'Semester deleted successfully' });
    } catch (error) {
      console.error('Error deleting semester:', error);
      return res.status(500).json({ message: 'Failed to delete semester', error: error.message });
    }
  };
  
  const getSemesterById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const semester = await Semester.findById(id)
        .populate('department', 'name abbreviation')
        .populate('course', 'name')
        .populate('subjects', 'name totalMarks totalCredits')
        .populate('students', 'fullName email');
  
      if (!semester) {
        return res.status(404).json({ message: 'Semester not found' });
      }
  
      return res.status(200).json({ semester });
    } catch (error) {
      console.error('Error fetching semester:', error);
      return res.status(500).json({ message: 'Failed to fetch semester', error: error.message });
    }
  };  
  
const getAllSemesters = async (req,res)=>{
    try {
        const allSemesters = await Semester.find({})
        .populate("department", "abbreviation")
        .populate("course", "name")
        .populate({
          path: "subjects",
          select: "subjectName subjectCode"
        })
        if(!allSemesters){return res.status(400).json({message: "Semesters not found"})};

        return res.status(200).json({message: "Semester fetch successful", semesters: allSemesters});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch semester', error: error.message });
    }
}

module.exports = {
    addSemester,
    updateSemester,
    deleteSemester,
    getSemesterById,
    getAllSemesters
}
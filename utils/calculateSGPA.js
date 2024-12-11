const Marks = require("../models/Marks");
const Subject = require("../models/Subject");

const calculateSGPA = async (studentId, semesterSubjects) => {
  let totalGradePoints = 0;
  let totalCredits = 0;

  for (const subjectData of semesterSubjects) {
    const { subjectId } = subjectData;

    const subject = await Subject.findById(subjectId);
    if (!subject) throw new Error(`Subject with id ${subjectId} not found`);

    const { fullMarks, credits } = subject;

    const marks = await Marks.findOne({ studentId, subjectId });
    if (!marks) throw new Error(`Marks not found for student ${studentId} in subject ${subjectId}`);

    const { midSemMarks, endSemMarks, internalAssessment } = marks;


    const obtainedMarks = midSemMarks + endSemMarks + internalAssessment;
    const percentage = (obtainedMarks / fullMarks) * 100;

    let gradePoint;
    if (percentage >= 90) gradePoint = 10;
    else if (percentage >= 80) gradePoint = 9;
    else if (percentage >= 70) gradePoint = 8;
    else if (percentage >= 60) gradePoint = 7;
    else if (percentage >= 50) gradePoint = 6;
    else if (percentage >= 40) gradePoint = 5;
    else gradePoint = 0;

    totalGradePoints += gradePoint * credits;
    totalCredits += credits;
  }

  const sgpa = totalGradePoints / totalCredits;
  return sgpa.toFixed(2);
};

module.exports = calculateSGPA;
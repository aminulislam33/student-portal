const Marks = require("../models/Marks");

const calculateSGPA = async (student, semesterSubjects) => {
  let totalGradePoints = 0;
  let totalCredits = 0;

  const { _id: studentId, EnrollmentId } = student;

  for (const subject of semesterSubjects) {
    const { _id: subjectId, subjectName, fullMarks, credits } = subject;

    console.log("from: ", subject.subjectName);

    const marks = await Marks.findOne({ studentId, subjectId });
    if (!marks) {
      throw new Error(
        `Marks not found for student with Enrollment ID "${EnrollmentId}" in subject "${subjectName}"`
      );
    }

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

  if (totalCredits === 0) {
    throw new Error(
      `No subjects with valid credits found for student with Enrollment ID "${enrollmentId}"`
    );
  }

  const sgpa = totalGradePoints / totalCredits;
  return sgpa.toFixed(2);
};

module.exports = calculateSGPA;
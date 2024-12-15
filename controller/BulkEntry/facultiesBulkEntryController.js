const xlsx = require('xlsx');
const Department = require('../../models/Department');
const Faculty = require('../../models/Faculty');
const addUser = require('../../utils/addUser');

const bulkEntryOfProfessors = async (req, res) => {
    const file = req.file;

    try {
        const workbook = xlsx.readFile(file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        for (const faculty of data) {
            const {fullName, email, gender, employeeID, designation, department, joiningYear} = faculty;

            const user = await addUser(fullName, email, gender);
            if(!user){
                console.warn(`User creation failed for the professor: ${employeeID}`);
                continue;
            };
            const userId = user?._id || user;

            const departmentDetails = await Department.findOne({ name: department });
            if (!departmentDetails) {
                console.warn(`Department "${department}" not found for professor: ${employeeID}`);
                continue;
            };

            const newFaculty = new Faculty({
                DBid: userId,
                employeeID,
                designation,
                department: departmentDetails._id,
                joiningYear,
              });
        
            await newFaculty.save();

            if (department) {
                try {
                  const getDepartment = await Department.findOne({ abbreviation: department });
              
                  if (!getDepartment) {
                    console.error(`Department with abbreviation '${department}' not found.`);
                    return res.status(404).json({ message: `Department with abbreviation '${department}' not found.` });
                  }
              
                  getDepartment.faculties.addToSet(newFaculty._id);
              
                  await getDepartment.save();
                } catch (error) {
                  console.error('Error adding faculty to department:', error);
                  return res.status(500).json({ message: 'Error adding faculty to department' });
                }
              }
        }

        res.status(201).json({ message: 'Bulk entry successful!' });
    } catch (error) {
        console.error('Error processing bulk entry:', error);
        res.status(500).json({ message: 'Error processing bulk entry' });
    }
};

module.exports = { bulkEntryOfProfessors };
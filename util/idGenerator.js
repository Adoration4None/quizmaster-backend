const studentService = require('../services/studentService');
const professorService = require('../services/professorService');
const groupService = require('../services/groupService');


const generateId = async (table) => {
    if (table === 'STUDENT') {
        try {
            const allStudents = await studentService.getAllStudents();
            return allStudents.length + 1;
        } catch (error) {
            console.log(`Error generating ID for ${table}: `, error);
            throw error;
        }
    }
    else if (table === 'PROFESSOR') {
        try {
            const allProfessors = await professorService.getAllProfessors();
            return allProfessors.length + 1;
        } catch (error) {
            console.log(`Error generating ID for ${table}: `, error);
            throw error;
        }
    }
    else if (table === 'GROUP') {
        try {
            const allGroups = await groupService.getAllGroups();
            return allGroups.length + 1;
        } catch (error) {
            console.log(`Error generating ID for ${table}: `, error);
            throw error;
        }
    }
    
};

module.exports = generateId;
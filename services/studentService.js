const Student = require('../database/entities/Student');

const getAllStudents = () => {
    return Student.getAllStudents();
}

const getStudent = (idStudent) => {
    return Student.getStudent(idStudent);
}

const registerStudent = (newStudent) => {
    return Student.registerStudent(newStudent)
}

const login = (loginData) => {
    return Student.login(loginData)
}

const updateStudent = (newStudent) => {
    return Student.updateStudent(newStudent)
}

const deleteStudent = (idStudent) => {
    return Student.deleteStudent(idStudent)
}


module.exports= {
    getAllStudents,
    getStudent,
    registerStudent,
    login,
    updateStudent,
    deleteStudent
}
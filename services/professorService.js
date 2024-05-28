const Professor = require('../database/entities/Professor');

const getAllProfessors = () => {
    return Professor.getAllProfessors();
}

const getProfessor = (idProfessor) => {
    return Professor.getProfessor(idProfessor);
}

const registerProfessor = (newProfessor) => {
    return Professor.registerProfessor(newProfessor)
}

const login = (loginData) => {
    return Professor.login(loginData)
}

const updateProfessor = (newProfessor) => {
    return Professor.updateProfessor(newProfessor)
}

const deleteProfessor = (idProfessor) => {
    return Professor.deleteProfessor(idProfessor)
}


module.exports= {
    getAllProfessors,
    getProfessor,
    registerProfessor,
    login,
    updateProfessor,
    deleteProfessor
}
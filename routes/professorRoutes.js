const express = require('express');
const professorController = require('../controllers/professorController');

const professorRouter  = express.Router();

professorRouter
    .get('/', professorController.getAllProfessors)
    .get('/:professorId', professorController.getProfessor)
    .post('/', professorController.registerProfessor)
    .post('/login', professorController.login)
    .put('/', professorController.updateProfessor)
    .delete('/:professorId', professorController.deleteProfessor)

module.exports = professorRouter
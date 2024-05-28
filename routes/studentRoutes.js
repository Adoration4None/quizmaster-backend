const express = require('express');
const studentController = require('../controllers/studentController');

const studentRouter  = express.Router();

studentRouter
    .get('/', studentController.getAllStudents)
    .get('/:studentId', studentController.getStudent)
    .post('/', studentController.registerStudent)
    .post('/login', studentController.login)
    .put('/', studentController.updateStudent)
    .delete('/:studentId', studentController.deleteStudent)

module.exports = studentRouter
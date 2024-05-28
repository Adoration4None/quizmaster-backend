const studentService = require('../services/studentService');
const generateId     = require('../util/idGenerator');
const Tables         = require('../util/tables');


const getAllStudents = (req, res) => {
    studentService.getAllStudents()
        .then(allStudents => {
            res.status(200).send({
                status: 'OK',
                data: allStudents
            })
        })
        .catch(error => {
            console.log('Error: ', error)
            res.status(500).send({ status: 'Error', message: 'Error getting the students list' })
        }) 
}


const getStudent = (req, res) => {
    const student = studentService.getStudent(req.params.studentId)
        .then(student => {
            if(student == null) {
                res.status(404).send({ status: 'Not Found' })
                return
            }
            res.status(200).send({ status: 'OK', data: student })
        })
        .catch(error => {
            console.log('Error: ', error)
            res.status(500).send({ status: 'Error', message: 'Error getting the student' })
        }) 
}


const registerStudent = (req, res) => {
    const { body } = req;

    if (!body.nombre || !body.apellidos || !body.email || !body.password || !body.semestre) {
        res.status(400).send({ status: 'Error', message: 'Missing required fields' });
        return;
    }

    generateId(Tables.STUDENT)
        .then(id => {
            const newStudent = {
                id: id,
                nombre: body.nombre,
                apellido: body.apellidos,
                email: body.email,
                contrasena: body.password,
                semestre: body.semestre
            };

            return studentService.registerStudent(newStudent);
        })
        .then(registeredStudent => {
            if (!registeredStudent) {
                res.status(500).send({ status: 'Error', message: 'Error registering the new Student' });
            } else {
                res.status(201).send({ status: 'OK', message: 'Student successfully registered' });
            }
        })
        .catch(error => {
            console.error('Error: ', error);
            res.status(500).send({ status: 'Error', message: 'Error registering the new Student' });
        });
};



const login = (req, res) =>{
    const { body } = req

    if(!body.email || !body.password) {
        res.status(400).send({ status: 'Error', message: 'Missing required fields' })
        return
    }

    const loginData = {
        email:      body.email,
        contrasena: body.password
    }

    const accessToken = studentService.login(loginData)
        .then(accessToken => {
            if(accessToken == null)
                res.status(404).send({ error: true, respuesta: 'Student not found: Wrong login data' })
            else {
                res
                    .status(200)
                    .header('authorization', accessToken)
                    .send({ error: false, respuesta: accessToken })
            } 
        })
        .catch(error => {
            console.log('Error: ', error)
            res.status(500).send({ error: true, respuesta: 'Error logging in' })
        }) 
}


const updateStudent = (req, res) => {
    const { body } = req;

    if (!body.id || !body.nombre || !body.apellidos || !body.email || !body.password || !body.semestre) {
        res.status(400).send({ status: 'Error', message: 'Missing required fields' });
        return;
    }

    studentService.updateStudent(body)
        .then(result => {
            res.status(200).send(result);
        })
        .catch (error => {
            res.status(500).send({ status: 'Error', message: error.message });
        })
}


const deleteStudent = (req, res) => {
    studentService.deleteStudent(req.params.studentId)
        .then(student => {
            if(student == null) {
                res.status(404).send({ status: 'Not Found' })
                return
            }
            res.status(200).send({ status: 'OK', data: student })
        })
        .catch(error => {
            console.log('Error: ', error)
            res.status(500).send({ status: 'Error', message: 'Error deleting the student' })
        }) 
}


module.exports = {
    getAllStudents,
    getStudent,
    registerStudent,
    login,
    updateStudent,
    deleteStudent
}
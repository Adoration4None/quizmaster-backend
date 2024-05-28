const professorService = require('../services/professorService');
const generateId     = require('../util/idGenerator');
const Tables         = require('../util/tables');


const getAllProfessors = (req, res) => {
    professorService.getAllProfessors()
        .then(allProfessors => {
            res.status(200).send({
                status: 'OK',
                data: allProfessors
            })
        })
        .catch(error => {
            console.log('Error: ', error)
            res.status(500).send({ status: 'Error', message: 'Error getting the Professors list' })
        }) 
}


const getProfessor = (req, res) => {
    const professor = professorService.getProfessor(req.params.professorId)
        .then(professor => {
            if(professor == null) {
                res.status(404).send({ status: 'Not Found' })
                return
            }
            res.status(200).send({ status: 'OK', data: professor })
        })
        .catch(error => {
            console.log('Error: ', error)
            res.status(500).send({ status: 'Error', message: 'Error getting the professor' })
        }) 
}


const registerProfessor = (req, res) => {
    const { body } = req;

    if (!body.nombre || !body.apellidos || !body.email || !body.password || !body.materia) {
        res.status(400).send({ status: 'Error', message: 'Missing required fields' });
        return;
    }

    generateId(Tables.PROFESSOR)
        .then(id => {
            const newProfessor = {
                id: id,
                nombre: body.nombre,
                apellido: body.apellidos,
                email: body.email,
                contrasena: body.password,
                idMateria: body.materia
            };

            return professorService.registerProfessor(newProfessor);
        })
        .then(registeredProfessor => {
            if (!registeredProfessor) {
                res.status(500).send({ status: 'Error', message: 'Error registering the new professor' });
            } else {
                res.status(201).send({ status: 'OK', message: 'professor successfully registered' });
            }
        })
        .catch(error => {
            console.error('Error: ', error);
            res.status(500).send({ status: 'Error', message: 'Error registering the new professor' });
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

    const accessToken = professorService.login(loginData)
        .then(accessToken => {
            if(accessToken == null)
                res.status(404).send({ error: true, respuesta: 'professor not found: Wrong login data' })
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


const updateProfessor = (req, res) => {
    const { body } = req;

    if (!body.id || !body.nombre || !body.apellidos || !body.email || !body.password || !body.materia) {
        res.status(400).send({ status: 'Error', message: 'Missing required fields' });
        return;
    }

    professorService.updateprofessor(body)
        .then(result => {
            res.status(200).send(result);
        })
        .catch (error => {
            res.status(500).send({ status: 'Error', message: error.message });
        })
}


const deleteProfessor = (req, res) => {
    professorService.deleteProfessor(req.params.professorId)
        .then(professor => {
            if(professor == null) {
                res.status(404).send({ status: 'Not Found' })
                return
            }
            res.status(200).send({ status: 'OK', data: professor })
        })
        .catch(error => {
            console.log('Error: ', error)
            res.status(500).send({ status: 'Error', message: 'Error deleting the professor' })
        }) 
}


module.exports = {
    getAllProfessors,
    getProfessor,
    registerProfessor,
    login,
    updateProfessor,
    deleteProfessor
}
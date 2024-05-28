if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const cors = require('cors')

const port = process.env.PORT || 3000;
const express = require('express');

const studentRouter   = require('./routes/studentRoutes');
const professorRouter = require('./routes/professorRoutes');
const groupRouter     = require('./routes/groupRoutes');
const subjectRouter   = require('./routes/subjectRoutes');
const testRouter      = require('./routes/testRoutes');
const questionRouter  = require('./routes/questionRoutes');
const themeRouter     = require('./routes/themeRoutes');
const unitRouter      = require('./routes/unitRoutes');
const indexRouter     = require('./routes/index');

const app = express();

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use('/api', indexRouter);
app.use('/api/estudiantes', studentRouter);
app.use('/api/profesores',  professorRouter);
/*
app.use('/api/grupos',      groupRouter);
app.use('/api/materias',    subjectRouter);
app.use('/api/examenes',    testRouter);
app.use('/api/preguntas',   questionRouter);
app.use('/api/temas',       themeRouter);
app.use('/api/unidades',    unitRouter);
*/

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
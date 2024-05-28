const oracledb = require('../db').oracledb;
const dbConfig = require('../db').dbConfig;
const jwtManager = require('../../security/jwtManager')

// Obtener todos los estudiantes del sistema
const getAllStudents = async () => {
  let connection;
  
    try {
      connection = await oracledb.getConnection(dbConfig);
  
      const result = await connection.execute(
        `BEGIN LISTAR_ESTUDIANTES(:cursor); END;`,
        {
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        }
      );
  
      const resultSet = result.outBinds.cursor;
      const rows = [];
  
      let row;
      while ((row = await resultSet.getRow())) {
        rows.push(row);
      }
  
      await resultSet.close();
      return rows;
    } 
    catch (err) {
      console.error(err);
      return err;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
}


// Obtener un estudiante buscado por ID
const getStudent = async (idStudent) => {
  let connection;
  
  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `BEGIN OBTENER_ESTUDIANTE_POR_ID(:id, :cursor); END;`,
      {
        id: idStudent,
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const resultSet = result.outBinds.cursor;
    const student = await resultSet.getRow();  // Espera obtener una sola fila
    await resultSet.close();

    if (student) {
      return student;
    } else {
      return 'Student not found';
    }

  } catch (err) {
    console.error(err);
    return err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}


// Registrar nuevo estudiante
const registerStudent = async (newStudent) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `BEGIN 
         REGISTRAR_ESTUDIANTE(:id, :nombre, :apellido, :email, :contrasena, :semestre);
       END;`,
      {
        id: newStudent.id,
        nombre: newStudent.nombre,
        apellido: newStudent.apellido,
        email: newStudent.email,
        contrasena: newStudent.contrasena,
        semestre: newStudent.semestre
      },
      { autoCommit: true }
    );

    return {
      success: true,
      message: 'Student successfully registered.'
    };

  } 
  catch (err) {
    console.error(err);

    let errorMessage = 'Ocurrió un error al registrar el estudiante.';
    if (err.errorNum === 20001) {
      errorMessage = 'El email ya está registrado en el sistema.';
    }

    return {
      success: false,
      message: errorMessage
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}


// Inicio de sesión de estudiante
const login = async (loginData) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `
      BEGIN
        INICIAR_SESION_ESTUDIANTE(:email, :contrasena, :cursor);
      END;
      `,
      {
        email: loginData.email,
        contrasena: loginData.contrasena,
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const resultSet = result.outBinds.cursor;
    const loggedStudent = await resultSet.getRow();

    await resultSet.close();

    // Verificar si se encontró el estudiante
    if (!loggedStudent) {
      throw new Error('Correo electrónico o contraseña incorrectos.');
    }

    // Generar el token
    const token = jwtManager.generateAccessToken(
      loggedStudent.ID_ESTUDIANTE, 
      loggedStudent.NOMBRE,
      loggedStudent.APELLIDO,
      'ESTUDIANTE',
      loggedStudent.EMAIL,
      '',
      loggedStudent.SEMESTRE
    );

    return token;

  } catch (error) {
    console.error('Error during login: ', error);
    throw new Error('Ocurrió un error durante el inicio de sesión.');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection: ', err);
      }
    }
  }
}


// Actualizar un estudiante
const updateStudent = async (studentData) => {
  let connection;

  try {
    // Conectar a la base de datos
    connection = await oracledb.getConnection(dbConfig);

    // Ejecutar el procedimiento almacenado
    await connection.execute(
      `
      BEGIN
        ACTUALIZAR_ESTUDIANTE(
          :id,
          :nombre,
          :apellido,
          :email,
          :contrasena,
          :semestre
        );
      END;
      `,
      {
        id: studentData.id,
        nombre: studentData.nombre,
        apellido: studentData.apellidos,
        email: studentData.email,
        contrasena: studentData.password,
        semestre: studentData.semestre
      },
      { autoCommit: true }
    );

    return { status: 'OK', message: 'Estudiante actualizado exitosamente' };

  } catch (error) {
    console.error('Error updating student: ', error);
    throw new Error('Error al actualizar la información del estudiante.');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection: ', err);
      }
    }
  }
}


// Eliminar estudiante
const deleteStudent = async (studentId) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `
      BEGIN
        ELIMINAR_ESTUDIANTE(:id);
      END;
      `,
      { id: studentId },
      { autoCommit: true } // Para confirmar los cambios automáticamente
    );

    return { status: 'OK', message: 'Estudiante eliminado exitosamente' };

  } 
  catch (error) {
    console.error('Error deleting student: ', error);
    throw new Error('Error al eliminar al estudiante.');
  } 
  finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection: ', err);
      }
    }
  }
}



module.exports = {
  getAllStudents,
  getStudent,
  registerStudent,
  login,
  updateStudent,
  deleteStudent
};

const oracledb = require('../db').oracledb;
const dbConfig = require('../db').dbConfig;
const jwtManager = require('../../security/jwtManager')


// Obtener todos los profesores del sistema
const getAllProfessors = async () => {
  let connection;
  
    try {
      connection = await oracledb.getConnection(dbConfig);
  
      const result = await connection.execute(
        `BEGIN LISTAR_PROFESORES(:cursor); END;`,
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


// Obtener un profesor buscado por ID
const getProfessor = async (idProfessor) => {
  let connection;
  
  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `BEGIN OBTENER_PROFESOR_POR_ID(:id, :cursor); END;`,
      {
        id: idProfessor,
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const resultSet = result.outBinds.cursor;
    const professor = await resultSet.getRow();  
    await resultSet.close();

    if (professor) {
      return professor;
    } else {
      return 'Professor not found';
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


// Registrar nuevo profesor
const registerProfessor = async (newProfessor) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `BEGIN 
         REGISTRAR_PROFESOR(:id, :nombre, :apellido, :email, :contrasena, :idMateria);
       END;`,
      {
        id: newProfessor.id,
        nombre: newProfessor.nombre,
        apellido: newProfessor.apellido,
        email: newProfessor.email,
        contrasena: newProfessor.contrasena,
        idMateria: newProfessor.idMateria
      },
      { autoCommit: true }
    );

    return {
      success: true,
      message: 'Professor successfully registered.'
    };

  } 
  catch (err) {
    console.error(err);

    let errorMessage = 'Ocurrió un error al registrar el profesor.';
    if (err.errorNum === 20001) {
      errorMessage = 'El email ya está registrado en el sistema.';
    }

    return {
      success: false,
      message: errorMessage
    };
  } 
  finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}


// Inicio de sesión de profesor
const login = async (loginData) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `
      BEGIN
        INICIAR_SESION_PROFESOR(:email, :contrasena, :cursor);
      END;
      `,
      {
        email: loginData.email,
        contrasena: loginData.contrasena,
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const resultSet = result.outBinds.cursor;
    const loggedProfessor = await resultSet.getRow();

    await resultSet.close();

    // Verificar si se encontró el profesor
    if (!loggedProfessor) {
      throw new Error('Correo electrónico o contraseña incorrectos.');
    }

    // Generar el token
    const token = jwtManager.generateAccessToken(
      loggedProfessor.ID_PROFESOR, 
      loggedProfessor.NOMBRE,
      loggedProfessor.APELLIDO,
      'PROFESOR',
      loggedProfessor.EMAIL,
      loggedProfessor.ID_MATERIA,
      ''
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


// Actualizar un profesor
const updateProfessor = async (professorData) => {
  let connection;

  try {
    // Conectar a la base de datos
    connection = await oracledb.getConnection(dbConfig);

    // Ejecutar el procedimiento almacenado
    await connection.execute(
      `
      BEGIN
        ACTUALIZAR_PROFESOR(
          :id,
          :nombre,
          :apellido,
          :email,
          :contrasena,
          :idMateria
        );
      END;
      `,
      {
        id: professorData.id,
        nombre: professorData.nombre,
        apellido: professorData.apellidos,
        email: professorData.email,
        contrasena: professorData.password,
        idMateria: professorData.materia
      },
      { autoCommit: true }
    );

    return { status: 'OK', message: 'Profesor actualizado exitosamente' };

  } catch (error) {
    console.error('Error updating Professor: ', error);
    throw new Error('Error al actualizar la información del profesor.');
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


// Eliminar profesor
const deleteProfessor = async (professorId) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `
      BEGIN
        ELIMINAR_PROFESOR(:id);
      END;
      `,
      { id: professorId },
      { autoCommit: true } 
    );

    return { status: 'OK', message: 'Profesor eliminado exitosamente' };

  } 
  catch (error) {
    console.error('Error deleting Professor: ', error);
    throw new Error('Error al eliminar al profesor.');
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
  getAllProfessors,
  getProfessor,
  registerProfessor,
  login,
  updateProfessor,
  deleteProfessor
};

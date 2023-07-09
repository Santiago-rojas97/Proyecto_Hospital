const express = require('express');
const connection = require('../db');
const citas = express.Router();
citas.use(express.json()); // Middleware para analizar los datos en formato JSON


// Ruta para crear una cita médica
citas.post('/', async (req, res) => {
    const { idPaciente, idDoctor, Especialidad, Fecha_Cita } = req.body;
  
    // Verifica si se proporcionaron todos los datos requeridos
    if (!idPaciente || !idDoctor || !Especialidad || !Fecha_Cita) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
  
    try {
      // Crea la consulta para insertar la cita médica en la base de datos
      const sql = 'INSERT INTO Cita (idPaciente, idDoctor, Especialidad,Fecha_Cita) VALUES (?, ?, ?, ?)';
      const values = [idPaciente, idDoctor, Especialidad, Fecha_Cita];
  
      // Ejecuta la consulta
      await connection.query(sql, values);
  
      res.json({ message: 'Cita médica creada exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });


module.exports=citas;
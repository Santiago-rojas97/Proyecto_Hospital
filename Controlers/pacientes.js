const express = require('express');
const connection = require('../db');
const pacientes = express.Router();
pacientes.use(express.json()); // Middleware para analizar los datos en formato JSON


// Ruta para crear un paciente

pacientes.post("/", async (req, res) => {
    try {
      const { idPacientes, Name_Pac, Apellido_Pac, Feha_Nac, Telefono } =
        req.body;
  
      const sql =
        "INSERT INTO Pacientes (idPacientes, Name_Pac, Apellido_Pac, Feha_Nac, Telefono) VALUES (?, ?, ?, ?, ?)";
      const values = [idPacientes, Name_Pac, Apellido_Pac, Feha_Nac, Telefono];
  
      await new Promise((resolve, reject) => {
        connection.query(sql, values, (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log(idPacientes,Name_Pac,Apellido_Pac,Feha_Nac,Telefono)
            resolve(result);
          }
        });
      });
  
      res.redirect("/Pacientes");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error al crear el paciente");
    }
  });

//Ruta para ver todos los pacientes

   pacientes.get("/", (req, res) => {
  const sql = "SELECT * FROM Pacientes ";

  connection.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al obtener los Pacientes ");
    } else {
      res.status(200).json(result);
    }
  });
}); 

// Ruta para ver un paciente por su ID

pacientes.get("/:id", (req, res) => {
    const pacienteId = req.params.id;
    const sql = "SELECT * FROM Pacientes WHERE idPacientes = ?";
  
    connection.query(sql, [pacienteId], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al obtener el Paciente");
      } else {
        if (result.length > 0) {
          res.status(200).json(result);
        } else {
          res.status(404).send("Paciente no encontrado");
        }
      }
    });
  });
  
//Ruta para eliminar un Paciente
  pacientes.post("/eliminar", async (req, res) => {
    const pacienteId = req.body.idPacientes;
  
    try {
      const sql = "DELETE FROM Pacientes WHERE idPacientes = ?";
      await connection.query(sql, [pacienteId]);
  
      res.json({
        message: `Paciente con ID ${pacienteId} eliminado exitosamente`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error en el servidor" });
    }
  }); 

module.exports = pacientes;
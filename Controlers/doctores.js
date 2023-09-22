const express = require('express');
const connection = require('../db');
const doctores = express.Router();
doctores.use(express.json()); // Middleware para analizar los datos en formato JSON

// Ruta para crear un doctor
doctores.post("/", async (req, res) => {
  try {
    const {
      idDoctores,
      Name_Doc,
      Apellido_Doc,
      Correo_Elec,
      Consultorio,
      id_Especialidades,
    } = req.body;

    const sql =
      "INSERT INTO Doctores (idDoctores,Name_Doc,Apellido_Doc,Correo_Elec,Consultorio,id_Especialidades) VALUES (?, ?, ?, ?, ?, ? )";
    const values = [
      idDoctores,
      Name_Doc,
      Apellido_Doc,
      Correo_Elec,
      Consultorio,
      id_Especialidades,
    ];

    await new Promise((resolve, reject) => {
      connection.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.redirect(301, "/Doctores");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear el doctor");
  }
});

//Ruta para ver listado de Doctores

doctores.get("/", (req, res) => {
  const sql = "SELECT * FROM Doctores ";

  connection.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al obtener los Doctores ");
    } else {
      res.status(200).json(result);
    }
  });
});

//Ruta para ver un doctor por su ID
doctores.get("/:id", (req, res) => {
  const doctorId = req.params.id;
  const sql = "SELECT * FROM Doctores WHERE idDoctores = ?";

  connection.query(sql, [doctorId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al obtener el doctor");
    } else {
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).send("Doctor no encontrado");
      }
    }
  });
});

//Ruta para eliminar un Doctor por su ID
doctores.post("/eliminar", async (req, res) => {
  const idDoctor = req.body.idDoctores;

  try {
    const sql = "DELETE FROM Doctores WHERE idDoctores = ?";
    await connection.query(sql, [idDoctor]);

    res.json({ message: `Doctor con ID ${idDoctor} eliminado exitosamente` });

  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = doctores;
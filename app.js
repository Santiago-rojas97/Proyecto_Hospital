const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use("/", require("./router"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
const connection = require('./db'); // Asegúrate de que la ruta sea correcta





// Ruta para crear un paciente
app.post("/Pacientes", async (req, res) => {
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

// Ruta para crear un doctor
app.post("/Doctores", async (req, res) => {
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

app.get("/pacientes", (req, res) => {
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
app.get("/pacientes/:id", (req, res) => {
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






//Ruta para ver listado de Doctores
app.get("/doctores", (req, res) => {
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
app.get("/doctores/:id", (req, res) => {
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




//Ruta para eliminar un Paciente
app.use(express.json()); // Middleware para analizar los datos en formato JSON

app.post("/pacientes/eliminar", async (req, res) => {
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

app.use(express.json()); // Middleware para analizar los datos en formato JSON

app.post("/doctores/eliminar", async (req, res) => {
  const idDoctor = req.body.idDoctores;

  try {
    const sql = "DELETE FROM Doctores WHERE idDoctores = ?";
    await connection.query(sql, [idDoctor]);

    res.json({ message: `Doctor con ID ${idDoctor} eliminado exitosamente` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});


// Ruta para crear una cita médica
app.post('/citas', async (req, res) => {
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


// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor iniciado en http://localhost:3000");
});

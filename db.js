const mysql = require("mysql");

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1010232",
  database: "mydb",
});

connection.connect((err) => {
  if (err) {
    console.log("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conexión exitosa a la base de datos");
});

module.exports = connection;

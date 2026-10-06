const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());

// Conexión con MySQL de Clever Cloud
const db = mysql.createConnection({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT
});

// Comprobar conexión
db.connect((error) => {
  if (error) {
    console.error("Error al conectar con MySQL:", error);
    return;
  }

  console.log("Conectado correctamente a MySQL");
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    mensaje: "API NUEVA FUNCIONANDO",
    version: "2"
  });
});
// Registrar usuario
app.post("/usuarios", (req, res) => {

  const { nombre, correo, contraseña } = req.body;

  if (!nombre || !correo || !contraseña) {
    return res.status(400).json({
      mensaje: "Todos los campos son obligatorios"
    });
  }

  const sql = `
    INSERT INTO Usuarios (nombre, correo, contraseña)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [nombre, correo, contraseña],
    (error, resultado) => {

      if (error) {
        console.error("Error al registrar usuario:", error);

        return res.status(500).json({
          mensaje: "Error al registrar usuario"
        });
      }

      res.status(201).json({
        ok: true,
        mensaje: "Usuario registrado correctamente",
        id: resultado.insertId
      });

    }
  );
});
app.get("/tablas", (req, res) => {
  db.query("SHOW TABLES", (error, resultados) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        error: error.message
      });
    }

    res.json(resultados);
  });
});
// Puerto de Clever Cloud
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Servidor ejecutándose en puerto " + PORT);
});

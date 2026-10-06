const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());


// ========================================
// CONEXIÓN CON MYSQL DE CLEVER CLOUD
// ========================================

const db = mysql.createConnection({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT
});


// Comprobar conexión con MySQL
db.connect((error) => {

  if (error) {
    console.error("Error al conectar con MySQL:", error);
    return;
  }

  console.log("Conectado correctamente a MySQL");

});


// ========================================
// RUTA PRINCIPAL
// ========================================

app.get("/", (req, res) => {

  res.status(200).json({
    ok: true,
    mensaje: "API NUEVA FUNCIONANDO 12345"
  });

});


// ========================================
// RUTA DE PRUEBA
// ========================================

app.get("/tablas", (req, res) => {

  res.status(200).json({
    ok: true,
    mensaje: "RUTA TABLAS FUNCIONANDO"
  });

});


// ========================================
// REGISTRAR USUARIO
// ========================================

app.post("/usuarios", (req, res) => {

  const { nombre, correo, contraseña } = req.body;


  if (!nombre || !correo || !contraseña) {

    return res.status(400).json({
      ok: false,
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

        console.error(
          "Error al registrar usuario:",
          error
        );

        return res.status(500).json({
          ok: false,
          mensaje: "Error al registrar usuario",
          error: error.message
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


// ========================================
// PUERTO DE CLEVER CLOUD
// ========================================

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {

  console.log(
    "Servidor ejecutándose en puerto " + PORT
  );

});

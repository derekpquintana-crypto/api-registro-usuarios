const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// ========================================
// CONFIGURACIÓN
// ========================================

app.use(cors());
app.use(express.json());

// ========================================
// CONEXIÓN CON MYSQL DE CLEVER CLOUD
// ========================================

const db = mysql.createPool({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ========================================
// COMPROBAR CONEXIÓN CON MYSQL
// ========================================

db.query("SELECT 1", (error) => {

  if (error) {

    console.error(
      "Error al conectar con MySQL:",
      error
    );

  } else {

    console.log(
      "Conectado correctamente a MySQL"
    );

  }

});

// ========================================
// RUTA PRINCIPAL
// ========================================

app.get("/", (req, res) => {

  res.json({
    ok: true,
    mensaje: "API FUNCIONANDO CORRECTAMENTE"
  });

});

// ========================================
// MOSTRAR TABLAS
// ========================================

app.get("/tablas", (req, res) => {

  db.query("SHOW TABLES", (error, resultados) => {

    if (error) {

      console.error(
        "Error al consultar las tablas:",
        error
      );

      return res.status(500).json({
        ok: false,
        mensaje: "Error al consultar MySQL",
        error: error.message
      });

    }

    res.json({
      ok: true,
      tablas: resultados
    });

  });

});

// ========================================
// CONSULTAR USUARIOS
// ========================================

app.get("/usuarios", (req, res) => {

  const sql = `
    SELECT id, nombre, correo
    FROM Usuarios
  `;

  db.query(sql, (error, resultados) => {

    if (error) {

      console.error(
        "Error al consultar usuarios:",
        error
      );

      return res.status(500).json({
        ok: false,
        mensaje: "Error al consultar usuarios",
        error: error.message
      });

    }

    res.json({
      ok: true,
      usuarios: resultados
    });

  });

});

// ========================================
// REGISTRAR USUARIO
// ========================================

app.post("/usuarios", (req, res) => {

  const {
    nombre,
    correo,
    contraseña
  } = req.body;


  // Validar campos

  if (!nombre || !correo || !contraseña) {

    return res.status(400).json({
      ok: false,
      mensaje: "Todos los campos son obligatorios"
    });

  }


  const sql = `
    INSERT INTO Usuarios
    (nombre, correo, contraseña)
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


        // Correo duplicado

        if (error.code === "ER_DUP_ENTRY") {

          return res.status(409).json({
            ok: false,
            mensaje: "Ese correo ya está registrado"
          });

        }


        return res.status(500).json({
          ok: false,
          mensaje: "Error al registrar usuario",
          error: error.message
        });

      }


      res.status(201).json({

        ok: true,

        mensaje:
          "Usuario registrado correctamente",

        id: resultado.insertId

      });

    }
  );

});

// ========================================
// RUTAS QUE NO EXISTEN
// ========================================

app.use((req, res) => {

  res.status(404).json({

    ok: false,

    mensaje: "Ruta no encontrada",

    ruta: req.originalUrl

  });

});

// ========================================
// PUERTO
// ========================================

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {

  console.log(
    "Servidor ejecutándose en puerto " + PORT
  );

});

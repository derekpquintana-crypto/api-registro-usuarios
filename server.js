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
    mensaje: "API funcionando correctamente"
  });
});

// Puerto de Clever Cloud
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Servidor ejecutándose en puerto " + PORT);
});

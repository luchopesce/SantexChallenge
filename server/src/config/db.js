const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log,
  }
);

async function initializeDatabase() {
  try {
    // Prueba la conexión
    await sequelize.authenticate();
    console.log("Conexión a MySQL establecida con éxito.");

    // Sincroniza los modelos con la base de datos
    await sequelize.sync({ force: false });
    console.log("Modelos sincronizados con la base de datos.");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
}

module.exports = { sequelize, initializeDatabase };

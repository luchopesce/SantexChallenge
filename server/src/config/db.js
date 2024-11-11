const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: (msg) => {
      if (msg.includes("SELECT")) {
        console.log(`[SQL SELECT] ${msg.slice(0, 80)}...`);
      } else {
        console.log(`[SQL] ${msg}`);
      }
    },
  }
);

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Conexión a MySQL establecida con éxito.");
    await sequelize.sync({ force: false });
    console.log("Modelos sincronizados con la base de datos.");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
}

module.exports = { sequelize, initializeDatabase };

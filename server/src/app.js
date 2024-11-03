const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { playerRouter } = require("./routes");
const { initializeDatabase } = require("./config/db");
const cors = require("cors");

const app = express();

initializeDatabase().then(() => {
  app.listen(process.env.SERVER_PORT, () => {
    console.log(
      `Server listening on ${process.env.SERVER_HTTP}:${process.env.SERVER_PORT}`
    );
  });
});

app.use(cors());
app.use(
  cors({
    origin: process.env.CLIENT_HTTP,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(bodyParser.json());
app.use(`${process.env.SERVER_NAME}/player`, playerRouter);

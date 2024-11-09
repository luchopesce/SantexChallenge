const express = require("express");
require("dotenv").config();
const { playerRouter } = require("./routes");
const { initializeDatabase } = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({ limit: "1mb" }));
app.use(cors());
app.use(
  cors({
    origin: process.env.CLIENT_HTTP,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

initializeDatabase().then(() => {
  app.listen(process.env.SERVER_PORT, () => {
    console.log(
      `Server listening on ${process.env.SERVER_HTTP}:${process.env.SERVER_PORT}`
    );
  });
});

app.use(`${process.env.SERVER_NAME}/player`, playerRouter);

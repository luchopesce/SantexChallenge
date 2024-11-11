const express = require("express");
require("dotenv").config();
const { playerRouter, authRouter } = require("./routes");
const { initializeDatabase } = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const { socketService } = require("./services");
const { authenticate } = require("./middleware");

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
  const server = app.listen(process.env.SERVER_PORT, () => {
    console.log(
      `Server listening on ${process.env.SERVER_HTTP}:${process.env.SERVER_PORT}`
    );
  });
  socketService.initializeSocketServer(server);
});

app.use(`${process.env.SERVER_NAME}/player`, authenticate, playerRouter);
app.use(`${process.env.SERVER_NAME}/auth`, authRouter);

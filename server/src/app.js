const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { logging } = require("./middleware");
const { userRouter, playerRouter } = require("./routes");
const { initializeDatabase } = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = 3000;

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});

app.use(cors());
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(bodyParser.json());
app.use("/user", userRouter);
app.use("/player", playerRouter);

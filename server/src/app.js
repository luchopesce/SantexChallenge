const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { logging } = require("./middleware");
const { userRouter } = require("./routes");
const { initializeDatabase } = require("./config/db");

const app = express();
const PORT = 3000;

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});

app.use(bodyParser.json());
app.use("/user", userRouter);

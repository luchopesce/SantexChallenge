const express = require("express");
const userService = require("../services/user");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await userService.getUser(id);
    res.status(201).json({ status: "ok", payload: response });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const response = await userService.createUser({
      firstName,
      lastName,
      email,
      password,
    });
    res.status(201).json({ status: "ok", payload: response });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;

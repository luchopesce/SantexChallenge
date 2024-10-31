const express = require("express");
const userService = require("../services/user");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await userService.getUserById(id);
    res.status(200).json({ status: "ok", payload: response });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/", async (req, res) => {
  const { firstName, email } = req.query;
  try {
    const response = await userService.getUsersByOptions({ firstName, email });
    res.status(200).json({ status: "ok", payload: response });
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

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email, password } = req.body;
  try {
    const response = await userService.updateUser(id, {
      firstName,
      lastName,
      email,
      password,
    });
    res.status(200).json({ status: "ok", payload: response });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await userService.deleteUser(id);
    res.status(200).json({ status: "ok", payload: response });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;

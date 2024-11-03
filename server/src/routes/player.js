const express = require("express");
const playerService = require("../services/player");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const params = req.query;
    const response = await playerService.getPlayers(params);
    res.status(200).json({ status: "ok", payload: response });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/export-csv", async (req, res) => {
  const filters = req.query;
  try {
    const csvData = await playerService.exportPlayers(filters);
    res.status(200).send(csvData);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await playerService.getPlayerById(id);
    res.status(200).json({ status: "ok", payload: response });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;

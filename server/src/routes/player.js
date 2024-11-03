const express = require("express");
const playerService = require("../services/player");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const params = req.query;
    const response = await playerService.getPlayers(params);
    res.status(200).json({ status: "OK", payload: response });
  } catch (error) {
    res.status(404).json({ status: "Not Found", message: error.message });
  }
});

router.get("/export-csv", async (req, res) => {
  try {
    const filters = req.query;
    const csvData = await playerService.exportPlayers(filters);
    res.status(200).send(csvData);
  } catch (error) {
    res.status(404).json({ status: "Not Found", message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const playerId = req.params.id;
    const response = await playerService.getPlayerById(playerId);
    res.status(200).json({ status: "OK", payload: response });
  } catch (error) {
    res.status(404).json({ status: "Not Found", message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const playerId = req.params.id;
    const newPlayerUpdated = req.body;
    const response = await playerService.updatePlayer(
      playerId,
      newPlayerUpdated
    );
    res.status(200).json({ status: "OK", payload: response });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Internal Server Error", message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const playerId = req.params.id;
    const response = await playerService.deletePlayer(playerId);
    res.status(200).json({ status: "OK", payload: response });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Internal Server Error", message: error.message });
  }
});

module.exports = router;

const express = require("express");
const playerService = require("../services/player");
const router = express.Router();

router.get("/", async (req, res) => {
  const { page = 1, limit = 10, name, club, position } = req.query;
  try {
    const response = await playerService.getPlayers({
      page,
      limit,
      name,
      club,
      position,
    });
    res.status(200).json({ status: "ok", payload: response });
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

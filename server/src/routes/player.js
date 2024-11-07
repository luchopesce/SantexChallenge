const express = require("express");
const multer = require("multer");
const { playerController } = require("../controllers");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", playerController.getPlayers);
router.get("/:id/:v", playerController.getPlayerById);
router.post(
  "/import-csv",
  upload.single("file"),
  playerController.importPlayers
);
router.put("/:id/:v", playerController.updatePlayer);

// router.get("/export-csv", async (req, res) => {
//   try {
//     const filters = req.query;
//     const csvData = await playerService.exportPlayers(filters);
//     res.status(200).send(csvData);
//   } catch (error) {
//     res.status(404).json({ status: "Not Found", message: error.message });
//   }
// });

// router.delete("/:id", async (req, res) => {
//   try {
//     const playerId = req.params.id;
//     const response = await playerService.deletePlayer(playerId);
//     res.status(200).json({ status: "OK", payload: response });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ status: "Internal Server Error", message: error.message });
//   }
// });

module.exports = router;

const express = require("express");
const multer = require("multer");
const { validationMiddleware } = require("../middleware");
const { playerValidator } = require("../validators");
const { playerController } = require("../controllers");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", playerController.getPlayers);
router.get("/history/:id", playerController.getPlayerHistory);
router.get(
  "/:id/:v",
  validationMiddleware(playerValidator),
  playerController.getPlayerById
);

router.post("/", playerController.createPlayer);

router.post(
  "/import-csv",
  upload.single("file"),
  playerController.importPlayers
);
router.put(
  "/:id/:v",
  validationMiddleware(playerValidator),
  playerController.updatePlayer
);

router.delete(
  "/:id/:v",
  validationMiddleware(playerValidator),
  playerController.deletePlayer
);

router.get("/export-csv", playerController.exportPlayers);

module.exports = router;

const express = require("express");
const multer = require("multer");
const { validationMiddleware, authenticate } = require("../middleware");
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

router.post("/", authenticate, playerController.createPlayer);

router.post(
  "/import-csv",
  authenticate,
  upload.single("file"),
  playerController.importPlayers
);
router.put(
  "/:id/:v",
  authenticate,
  validationMiddleware(playerValidator),
  playerController.updatePlayer
);

router.delete(
  "/:id/:v",
  authenticate,
  validationMiddleware(playerValidator),
  playerController.deletePlayer
);

router.get("/export-csv", authenticate, playerController.exportPlayers);

module.exports = router;

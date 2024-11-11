const express = require("express");
const multer = require("multer");
const { playerController } = require("../controllers");
const router = express.Router();
const upload = multer({ dest: "uploads/" });
const { validationMiddleware } = require("../middleware");
const { playerValidator } = require("../validators");

router.get("/", playerController.getPlayers);
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

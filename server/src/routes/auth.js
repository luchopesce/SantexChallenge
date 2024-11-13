const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");
const { userValidator } = require("../validators");
const { validationMiddleware, authenticate } = require("../middleware");

router.post(
  "/register",
  validationMiddleware(userValidator),
  authController.registerUser
);

router.get("/settings", authenticate, authController.getUserData);

router.post(
  "/login",
  validationMiddleware(userValidator),
  authController.loginUser
);

module.exports = router;

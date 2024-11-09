const authMiddleware = (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .json({ status: "error", message: "Login incorrect" });
  }
  next();
};

module.exports = authMiddleware;

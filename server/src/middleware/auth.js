const authMiddleware = (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Login incorrect" });
  }
  next();
};

module.exports = authMiddleware;

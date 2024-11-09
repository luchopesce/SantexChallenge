const handleError = (res, error) => {
  const status = error.status || 500;
  const message = error.message || "Error interno del servidor";

  res.status(status).json({
    status: "error",
    message,
  });
};

module.exports = handleError;

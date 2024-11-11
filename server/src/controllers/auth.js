const { authService } = require("../services");
const handleError = require("../utils/errorHandler");

const registerUser = async (req, res) => {
  const userData = req.body;
  try {
    const newUser = await authService.registerUser(userData);
    res.status(201).json({
      status: "ok",
      message: `Registro completadado. se registro el nuevo usuario: ${newUser.username} `,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userLogged = await authService.loginUser(username, password);
    res.status(200).json({
      status: "ok",
      token: userLogged.token,
      message: `Login exitoso`,
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};

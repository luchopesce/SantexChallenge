const { authProvider } = require("../providers");

const registerUser = async (userData) => {
  try {
    const userExist = await authProvider.checkExistUser(userData.username);
    if (userExist) {
      const error = new Error("El usuario ingresado ya existe");
      error.status = 400;
      throw error;
    }

    const newUser = await authProvider.registerUser(userData);
    return newUser;
  } catch (error) {
    throw error;
  }
};

const getUserData = async (userData) => {
  try {
    const userExist = await authProvider.checkExistUser(userData.username, [
      "username",
      "createdAt",
    ]);
    if (!userExist) {
      const error = new Error("El usuario ingresado no existe");
      error.status = 400;
      throw error;
    }
    return userExist;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (userData) => {
  try {
    const userExist = await authProvider.checkExistUser(userData.username);
    if (!userExist) {
      const error = new Error("El usuario ingresado no existe");
      error.status = 400;
      throw error;
    }
    const userLogged = await authProvider.loginUser(
      userExist,
      userData.password
    );
    if (!userLogged) {
      const error = new Error("Los datos ingresados no coinciden");
      error.status = 400;
      throw error;
    }
    return userLogged;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserData,
};

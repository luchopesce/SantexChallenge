const { userModel } = require("../models");

const createUser = async (obj) => {
  try {
    const newUser = await userModel.create(obj);
    return newUser;
  } catch (error) {
    throw error;
  }
};

const getUser = async (id) => {
  try {
    const user = await userModel.findByPk(id);
    if (!user) {
      throw new Error("El usuario no existe");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getUser,
};

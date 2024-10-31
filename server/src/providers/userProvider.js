const { Op } = require("sequelize");
const { User } = require("../models");

const createUser = async (obj) => {
  try {
    const newUser = await User.create(obj);
    return newUser;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("El usuario no existe");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const getUsersByOptions = async (options) => {
  try {
    const users = await User.findAll({ where: { [Op.or]: options } });
    if (!users) {
      throw new Error("No se encontraron usuarios");
    }
    return users;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userId, user) => {
  try {
    await getUserById(userId);
    await User.update(user, {
      where: { id: userId },
      returning: true,
    });
    console.log("Se actualizarion las filas en la DB");
    return await getUserById(userId);
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    await getUserById(userId);
    return await User.destroy({ where: { id: userId } });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getUserById,
  getUsersByOptions,
  updateUser,
  deleteUser,
};

const userProvider = require("../providers/userProvider");

const getUserById = async (id) => {
  return await userProvider.getUserById(id);
};

const getUsersByOptions = async (options) => {
  return await userProvider.getUsersByOptions(options);
};

const createUser = async (user) => {
  return await userProvider.createUser(user);
};

const updateUser = async (id, user) => {
  return await userProvider.updateUser(id, user);
};

const deleteUser = async (id) => {
  return await userProvider.deleteUser(id);
};

module.exports = {
  createUser,
  getUserById,
  getUsersByOptions,
  updateUser,
  deleteUser,
};

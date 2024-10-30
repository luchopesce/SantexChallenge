const userProvider = require("../providers/userProvider");

const getUser = async (id) => {
  return await userProvider.getUser(id);
};

const createUser = async (obj) => {
  return await userProvider.createUser(obj);
};

module.exports = { createUser, getUser };

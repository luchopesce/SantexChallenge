const playerProvider = require("../providers/playerProvider");

const getPlayers = async (params) => {
  return await playerProvider.getPlayers(params);
};

const getPlayerById = async (playerId) => {
  return await playerProvider.getPlayerById(playerId);
};

const exportPlayers = async (params) => {
  return await playerProvider.exportPlayers(params);
};

module.exports = {
  getPlayers,
  getPlayerById,
  exportPlayers,
};

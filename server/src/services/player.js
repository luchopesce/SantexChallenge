const playerProvider = require("../providers/playerProvider");

const getPlayers = async (query) => {
  return await playerProvider.getPlayers(query);
};

const getPlayerById = async (playerId) => {
  return await playerProvider.getPlayerById(playerId);
};

module.exports = {
  getPlayers,
  getPlayerById,
};

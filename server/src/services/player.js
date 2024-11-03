const playerProvider = require("../providers/playerProvider");

const getPlayers = async (params) => {
  return await playerProvider.getPlayers(params);
};

const getPlayerById = async (playerId) => {
  const player = await playerProvider.getPlayerById(playerId);

  player.dataValues.skills = {
    pace: player.dataValues.pace,
    shooting: player.dataValues.shooting,
    passing: player.dataValues.passing,
    dribbling: player.dataValues.dribbling,
    defending: player.dataValues.defending,
    physic: player.dataValues.physic,
  };
  return player;
};

const exportPlayers = async (params) => {
  return await playerProvider.exportPlayers(params);
};

const updatePlayer = async (playerId, newPlayerUpdated) => {
  return await playerProvider.updatePlayer(playerId, newPlayerUpdated);
};

const deletePlayer = async (playerId) => {
  return await playerProvider.deletePlayer(playerId);
};

module.exports = {
  getPlayers,
  getPlayerById,
  exportPlayers,
  updatePlayer,
  deletePlayer,
};

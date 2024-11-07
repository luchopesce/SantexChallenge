const { playerProvider } = require("../providers");

const getPlayers = async (params) => {
  try {
    const result = await playerProvider.getPlayers(params);
    return result;
  } catch (error) {
    return error;
  }
};

const getPlayerById = async (playerId, fifaVersion) => {
  try {
    const player = await playerProvider.getPlayerById(playerId, fifaVersion);
    player.dataValues.skills = {
      pace: player.dataValues.pace,
      shooting: player.dataValues.shooting,
      passing: player.dataValues.passing,
      dribbling: player.dataValues.dribbling,
      defending: player.dataValues.defending,
      physic: player.dataValues.physic,
    };
    return player;
  } catch (error) {
    return error;
  }
};

const importPlayers = async (file) => {
  try {
    const result = await playerProvider.importPlayers(file);
    return result;
  } catch (error) {
    return error;
  }
};

const updatePlayer = async (playerId, fifaVersion, newPlayerUpdated) => {
  try {
    const result = await playerProvider.updatePlayer(
      playerId,
      fifaVersion,
      newPlayerUpdated
    );
    return result;
  } catch (error) {
    return error;
  }
};

const exportPlayers = async (params) => {
  return await playerProvider.exportPlayers(params);
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
  importPlayers,
};

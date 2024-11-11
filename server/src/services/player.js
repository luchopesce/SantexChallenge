const { playerProvider } = require("../providers");
const { Player } = require("../models");

const getPlayers = async (params) => {
  try {
    const players = await playerProvider.getPlayers(params);
    return players;
  } catch (error) {
    throw error;
  }
};

const createPlayer = async (newPlayer) => {
  const parsedPlayerId = parseInt(newPlayer.player_id);
  try {
    const playerExist = await playerProvider.getPlayerById(
      parsedPlayerId,
      newPlayer.fifa_version
    );
    if (playerExist) {
      const error = new Error(
        "Problemas con el ID / Fifa Version ingresado, deben ser unicos"
      );
      error.status = 400;
      throw error;
    }

    const newPlayerCreated = await playerProvider.createPlayer(newPlayer);

    return newPlayerCreated;
  } catch (error) {
    throw error;
  }
};

const getPlayerById = async (playerId, fifaVersion) => {
  const parsedPlayerId = parseInt(playerId);
  try {
    const player = await playerProvider.getPlayerById(
      parsedPlayerId,
      fifaVersion
    );
    if (!player) {
      const error = new Error(
        "No se encontro el player con esos datos ingresados"
      );
      error.status = 404;
      throw error;
    }
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
    throw error;
  }
};

const getPlayerHistory = async (playerId) => {
  const parsedPlayerId = parseInt(playerId);
  try {
    const playerHistory = await playerProvider.getPlayerHistory(parsedPlayerId);

    return playerHistory;
  } catch (error) {
    throw error;
  }
};

const updatePlayer = async (playerId, fifaVersion, newPlayerUpdated) => {
  const parsedPlayerId = parseInt(playerId);

  const filteredUpdate = Player.validateFields(newPlayerUpdated);

  if (Object.keys(filteredUpdate).length === 0) {
    const error = new Error("No hay campos válidos para actualizar");
    error.status = 400;
    throw error;
  }

  try {
    const originalPlayer = await getPlayerById(parsedPlayerId, fifaVersion);
    const newPlayerId = newPlayerUpdated.player_id || playerId;
    const newFifaVersion = newPlayerUpdated.fifa_version || fifaVersion;

    if (newPlayerId !== parsedPlayerId || newFifaVersion !== fifaVersion) {
      const existingPlayer = await playerProvider.getPlayerById(
        newPlayerId,
        newFifaVersion
      );
      if (existingPlayer) {
        const error = new Error(
          "El playerId y fifaVersion ya existen en la base de datos. Los valores deben ser únicos."
        );
        error.status = 400;
        throw error;
      }
    }

    const updatedPlayerData = {
      ...originalPlayer.dataValues,
      ...filteredUpdate,
    };

    const playerUpdated = await playerProvider.updatePlayer(
      parsedPlayerId,
      fifaVersion,
      updatedPlayerData
    );

    return playerUpdated;
  } catch (error) {
    throw error;
  }
};

const deletePlayer = async (playerId, fifaVersion) => {
  const parsedPlayerId = parseInt(playerId);
  try {
    await getPlayerById(parsedPlayerId, fifaVersion);
    const playerDeleted = await playerProvider.deletePlayer(
      playerId,
      fifaVersion
    );
    return playerDeleted;
  } catch (error) {
    throw error;
  }
};

const importPlayers = async (file) => {
  if (!file) {
    const error = new Error("No ingresaste ningun archivo");
    error.status = 400;
    throw error;
  }
  try {
    const result = await playerProvider.importPlayers(file);
    return result;
  } catch (error) {
    throw error;
  }
};

const exportPlayers = async (params) => {
  try {
    const result = await playerProvider.exportPlayers(params);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getPlayers,
  getPlayerById,
  exportPlayers,
  updatePlayer,
  deletePlayer,
  importPlayers,
  createPlayer,
  getPlayerHistory,
};

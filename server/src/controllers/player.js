const { playerService, socketService } = require("../services");
const handleError = require("../utils/errorHandler");

const getPlayers = async (req, res) => {
  const params = req.query;
  try {
    const { currentPage, limit, totalPages, totalItems, data } =
      await playerService.getPlayers(params);
    res.status(200).json({
      status: "ok",
      data,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        limit,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

const createPlayer = async (req, res) => {
  const body = req.body;
  try {
    const newPlayer = await playerService.createPlayer(body);
    socketService.emitPlayerCreated(newPlayer);
    res.status(201).json({
      status: "ok",
      data: newPlayer,
      message: `Creacion completada. se registro el nuevo player: ${newPlayer.long_name} `,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getPlayerById = async (req, res) => {
  const playerId = req.params.id;
  const fifaVersion = req.params.v;
  try {
    const player = await playerService.getPlayerById(playerId, fifaVersion);
    res.status(200).json({ status: "ok", data: player });
  } catch (error) {
    handleError(res, error);
  }
};

const getPlayerHistory = async (req, res) => {
  const playerId = req.params.id;
  try {
    const playerHistory = await playerService.getPlayerHistory(playerId);
    res.status(200).json({ status: "ok", data: playerHistory });
  } catch (error) {
    handleError(res, error);
  }
};

const updatePlayer = async (req, res) => {
  const playerId = req.params.id;
  const fifaVersion = req.params.v;
  const newPlayerUpdated = req.body;
  try {
    const playerUpdated = await playerService.updatePlayer(
      playerId,
      fifaVersion,
      newPlayerUpdated
    );
    socketService.emitPlayerUpdated(playerUpdated);
    res.status(200).json({
      status: "ok",
      data: playerUpdated,
      message: `Se actualizo correctamente el player: ${playerUpdated.long_name}`,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const deletePlayer = async (req, res) => {
  const playerId = req.params.id;
  const fifaVersion = req.params.v;
  try {
    const playerDeleted = await playerService.deletePlayer(
      playerId,
      fifaVersion
    );
    socketService.emitPlayerDeleted(playerDeleted);
    res.status(200).json({
      status: "ok",
      data: playerDeleted,
      message: `Se elimino correctamente el player: ${playerDeleted.long_name}`,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const importPlayers = async (req, res) => {
  const file = req.file;
  try {
    const { totalCreated, totalProcessed } = await playerService.importPlayers(
      file
    );
    socketService.emitPlayerImport();
    res.status(200).json({
      status: "ok",
      data: {
        totalCreated,
        totalProcessed,
      },
      message: `Importación completada. ${totalCreated} jugadores creados de ${totalProcessed} procesados.`,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const exportPlayers = async (req, res) => {
  const filters = req.query;
  try {
    const csvData = await playerService.exportPlayers(filters);
    res.status(200).send(csvData);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getPlayers,
  getPlayerById,
  importPlayers,
  updatePlayer,
  deletePlayer,
  exportPlayers,
  createPlayer,
  getPlayerHistory,
};

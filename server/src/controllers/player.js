const { playerService } = require("../services");

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
    console.error("Error durante la peticion de players:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error interno del servidor",
    });
  }
};

const getPlayerById = async (req, res) => {
  const playerId = req.params.id;
  const fifaVersion = req.params.v;
  try {
    const player = await playerService.getPlayerById(playerId, fifaVersion);
    res.status(200).json({ status: "ok", data: player });
  } catch (error) {
    console.error("Error durante la peticion del player:", error);
    res.status(404).json({
      status: "error",
      message: error.message || "Error interno del servidor",
    });
  }
};

const importPlayers = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({
      status: "error",
      message: "No se ha subido ningún archivo",
    });
  }

  try {
    const { totalCreated, totalProcessed } = await playerService.importPlayers(
      file
    );
    res.status(200).json({
      status: "ok",
      data: {
        totalCreated,
        totalProcessed,
      },
      message: `Importación completada. ${totalCreated} jugadores creados de ${totalProcessed} procesados.`,
    });
  } catch (error) {
    console.error("Error durante la importación de jugadores:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Hubo un problema al procesar el archivo.",
    });
  }
};

const updatePlayer = async (req, res) => {
  const playerId = req.params.id;
  const fifaVersion = req.params.v;
  const newPlayerUpdated = req.body;
  console.log(playerId, fifaVersion, newPlayerUpdated);

  try {
    const playerUpdated = await playerService.updatePlayer(
      playerId,
      fifaVersion,
      newPlayerUpdated
    );
    res.status(200).json({
      status: "ok",
      data: {
        playerUpdated,
      },
      message: `Se actualizo correctamente el player: ${playerUpdated.long_name}`,
    });
  } catch (error) {
    console.error("Error durante la actualizacion del player:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error interno del servidor",
    });
  }
};

module.exports = { getPlayers, getPlayerById, importPlayers, updatePlayer };

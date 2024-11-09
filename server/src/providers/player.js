const { Op } = require("sequelize");
const fs = require("fs").promises;
const { Parser } = require("json2csv");
const { parseCSVFile } = require("../utils/utils");
const { Player } = require("../models");

const getPlayers = async (params) => {
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 10;
  const offset = (page - 1) * limit;
  const options = {
    where: {},
    limit,
    offset,
  };
  if (params.searchTerm) {
    options.where = {
      [Op.or]: [
        { player_id: { [Op.like]: `%${params.searchTerm}%` } },
        { long_name: { [Op.like]: `%${params.searchTerm}%` } },
        { club_name: { [Op.like]: `%${params.searchTerm}%` } },
        { player_positions: { [Op.like]: `%${params.searchTerm}%` } },
      ],
    };
  }

  const playerAttributes = Object.keys(Player.rawAttributes);
  for (const attr of playerAttributes) {
    if (params[attr]) {
      options.where[attr] = { [Op.like]: `%${params[attr]}%` };
    }
  }

  try {
    const { count, rows } = await Player.findAndCountAll(options);
    return {
      currentPage: page,
      limit,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      data: rows,
    };
  } catch (error) {
    console.error("ERROR:", error.message);
    throw new Error("Problemas al obtener los players desde la base de datos");
  }
};

const getPlayerById = async (playerId, fifaVersion) => {
  try {
    const player = await Player.findOne({
      where: {
        player_id: parseInt(playerId),
        fifa_version: fifaVersion,
      },
    });
    return player;
  } catch (error) {
    console.error("ERROR:", error.message);
    throw new Error("Problemas al obtener el player desde la base de datos");
  }
};

const updatePlayer = async (playerId, fifaVersion, newPlayerUpdated) => {
  try {
    await Player.update(newPlayerUpdated, {
      where: { player_id: playerId, fifa_version: fifaVersion },
      returning: true,
    });

    const playerUpdated = await getPlayerById(
      newPlayerUpdated.player_id,
      newPlayerUpdated.fifa_version
    );
    return playerUpdated;
  } catch (error) {
    console.error("ERROR:", error.message);
    throw new Error("Problemas al actualizar el player desde la base de datos");
  }
};

const deletePlayer = async (playerId, fifaVersion) => {
  try {
    const playerToDelete = await getPlayerById(playerId, fifaVersion);
    await Player.destroy({
      where: { player_id: parseInt(playerId), fifa_version: fifaVersion },
    });
    return playerToDelete;
  } catch (error) {
    console.error("ERROR:", error.message);
    throw new Error("Problemas al eliminar el player");
  }
};

const importPlayers = async (file) => {
  try {
    const playerAttributes = Object.keys(Player.rawAttributes);
    const parsePlayers = await parseCSVFile(file.path, playerAttributes);
    const chunkSize = 1000;
    let totalProcessed = 0;
    let totalCreated = 0;

    const filteredPlayers = {};

    parsePlayers.forEach((player) => {
      const key = `${player.player_id}-${player.fifa_version}`;
      const currentUpdate = parseInt(player.fifa_update);

      if (
        !filteredPlayers[key] ||
        currentUpdate > parseInt(filteredPlayers[key].fifa_update)
      ) {
        filteredPlayers[key] = player;
      }
    });

    const uniquePlayersList = Object.values(filteredPlayers);

    for (let i = 0; i < uniquePlayersList.length; i += chunkSize) {
      const chunk = uniquePlayersList.slice(i, i + chunkSize);

      const existingPlayers = await Player.findAll({
        where: {
          [Op.or]: chunk.map((player) => ({
            [Op.and]: [
              { player_id: player.player_id },
              { fifa_version: player.fifa_version },
            ],
          })),
        },
        attributes: ["player_id", "fifa_version"],
      });

      const existingKeys = new Set(
        existingPlayers.map(
          (player) => `${player.player_id}-${player.fifa_version}`
        )
      );

      const newPlayers = chunk.filter((player) => {
        const key = `${player.player_id}-${player.fifa_version}`;
        return !existingKeys.has(key);
      });

      const result = await Player.bulkCreate(newPlayers, {
        fields: playerAttributes,
      });

      totalProcessed += chunk.length;
      totalCreated += result.length;
    }

    return {
      totalProcessed,
      totalCreated,
    };
  } catch (error) {
    console.error("ERROR:", error.message);
    throw new Error("Problemas al importar los players a la base de datos");
  } finally {
    await fs.unlink(file.path);
  }
};

const exportPlayers = async (params) => {
  const options = {
    where: {},
  };

  if (params.searchTerm) {
    options.where = {
      [Op.or]: [
        {
          player_id: { [Op.like]: `%${params.searchTerm}%` },
        },
        {
          long_name: { [Op.like]: `%${params.searchTerm}%` },
        },
        {
          club_name: { [Op.like]: `%${params.searchTerm}%` },
        },
        {
          player_positions: { [Op.like]: `%${params.searchTerm}%` },
        },
      ],
    };
  }

  try {
    const data = await Player.findAll(options);
    const jsonData = data.map((record) => record.toJSON());
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(jsonData);
    return csv;
  } catch (error) {
    console.error("ERROR:", error.message);
    throw new Error('"Problemas al exportar datos a CSV');
  }
};

module.exports = {
  getPlayers,
  getPlayerById,
  exportPlayers,
  updatePlayer,
  deletePlayer,
  importPlayers,
};

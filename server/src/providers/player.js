const { Op } = require("sequelize");
const fs = require("fs").promises;
const { Parser } = require("json2csv");
const { parseCSVFile } = require("../utils/utils");
const { Player, Player1 } = require("../models");

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
    console.error("Error al obtener los jugadores:", error);
    throw new Error("Error al obtener los jugadores");
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
    if (!player) {
      throw new Error("El player no existe");
    }
    return player;
  } catch (error) {
    console.error("Problemas al traer player", error);
    throw new Error("Problemas al traer player");
  }
};

const importPlayers = async (file) => {
  try {
    const playerAttributes = Object.keys(Player.rawAttributes);
    const parsePlayers = await parseCSVFile(file.path, playerAttributes);
    const chunkSize = 1000;
    let totalProcessed = 0;
    let totalCreated = 0;

    for (let i = 0; i < parsePlayers.length; i += chunkSize) {
      const chunk = parsePlayers.slice(i, i + chunkSize);
      const result = await Player.bulkCreate(chunk, {
        ignoreDuplicates: true,
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
    console.error("Problemas al importar jugadores: ", error);
    throw new Error("Problemas al importar jugadores");
  } finally {
    await fs.unlink(file.path);
  }
};

const updatePlayer = async (playerId, fifaVersion, newPlayerUpdated) => {
  try {
    await getPlayerById(playerId, fifaVersion);
    await Player.update(newPlayerUpdated, {
      where: { player_id: parseInt(playerId), fifa_version: fifaVersion },
      returning: true,
    });
    const playerUpdated = await getPlayerById(
      newPlayerUpdated.player_id,
      newPlayerUpdated.fifa_version
    );
    return playerUpdated;
  } catch (error) {
    console.error("Problemas al actualizar player:", error);
    throw new Error("Problemas al actualizar el player");
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
    console.error("Error al exportar datos a CSV:", error);
    throw new Error('"Error al exportar datos a CSV');
  }
};

const deletePlayer = async (playerId) => {
  try {
    await getPlayerById(playerId);
    return await Player.destroy({ where: { id: parseInt(playerId) } });
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
};

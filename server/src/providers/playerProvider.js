const { Op } = require("sequelize");
const { Player } = require("../models");
const { Parser } = require("json2csv");

const getPlayers = async (params) => {
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 10;
  const offset = (page - 1) * limit;
  const options = {
    where: {},
    limit: limit,
    offset,
  };

  if (params.searchTerm) {
    options.where = {
      [Op.or]: [
        {
          id: { [Op.like]: `%${params.searchTerm}%` },
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
      limit: limit,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      payload: rows,
    };
  } catch (error) {
    console.error("Error al traer los players", error);
    throw error;
  }
};

const getPlayerById = async (playerId) => {
  try {
    const player = await Player.findByPk(playerId);
    if (!player) {
      throw new Error("El player no existe");
    }
    return player;
  } catch (error) {
    console.error("Error al traer el player", error);
    throw error;
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
          id: { [Op.like]: `%${params.searchTerm}%` },
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
    throw error;
  }
};

const updatePlayer = async (playerId, newPlayerUpdated) => {
  try {
    await getPlayerById(playerId);
    await Player.update(newPlayerUpdated, {
      where: { id: parseInt(playerId) },
      returning: true,
    });
    console.log("Se actualizarion las filas en la DB");
    return await getPlayerById(playerId);
  } catch (error) {
    console.error("Error al actualizar player:", error);
    throw error;
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
};

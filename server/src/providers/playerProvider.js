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
    console.error("Error al traer players", error);
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
    throw error;
  }
};

const exportPlayers = async (params) => {
  const options = {
    where: {},
  };

  const playerAttributes = Object.keys(Player.rawAttributes);
  for (const attr of playerAttributes) {
    if (params[attr]) {
      options.where[attr] = { [Op.like]: `%${params[attr]}%` };
    }
  }

  const queryOptions = Object.keys(params).length > 0 ? options : {};

  try {
    const data = await Player.findAll(queryOptions);
    const jsonData = data.map((record) => record.toJSON());
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(jsonData);
    return csv;
  } catch (error) {
    console.error("Error al exportar datos a CSV:", error);
    throw error;
  }
};

module.exports = {
  getPlayers,
  getPlayerById,
  exportPlayers,
};

const { Op } = require("sequelize");
const { Player } = require("../models");

const getPlayers = async (query) => {
  const page = parseInt(query.page);
  const limit = parseInt(query.limit);
  const offset = (page - 1) * limit;
  const options = {
    where: {},
    limit: limit,
    offset,
  };

  if (query.name) options.where.long_name = { [Op.like]: `%${query.name}%` };
  if (query.club) options.where.club_name = { [Op.like]: `%${query.club}%` };
  if (query.position)
    options.where.player_positions = { [Op.like]: `%${query.position}%` };

  try {
    const { count, rows } = await Player.findAndCountAll(options);
    return {
      page: page,
      limit: limit,
      totalPages: Math.ceil(count / limit),
      totalResults: count,
      results: rows,
    };
  } catch (error) {
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

module.exports = {
  getPlayers,
  getPlayerById,
};

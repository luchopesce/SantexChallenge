const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Player = sequelize.define(
  "players",
  {
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    fifa_version: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    fifa_update: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fifa_update_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    player_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    short_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    long_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    player_positions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    overall: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    potential: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    value_eur: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    wage_eur: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    height_cm: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    weight_kg: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    league_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    league_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    league_level: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    club_team_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    club_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    club_position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    club_jersey_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    club_loaned_from: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    club_joined_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    club_contract_valid_until_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nationality_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nationality_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nation_team_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nation_position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nation_jersey_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    preferred_foot: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    weak_foot: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    skill_moves: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    international_reputation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    work_rate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    body_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    real_face: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    release_clause_eur: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    player_tags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    player_traits: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pace: { type: DataTypes.INTEGER, allowNull: true },
    shooting: { type: DataTypes.INTEGER, allowNull: true },
    passing: { type: DataTypes.INTEGER, allowNull: true },
    dribbling: { type: DataTypes.INTEGER, allowNull: true },
    defending: { type: DataTypes.INTEGER, allowNull: true },
    physic: { type: DataTypes.INTEGER, allowNull: true },
    attacking_crossing: { type: DataTypes.INTEGER, allowNull: true },
    attacking_finishing: { type: DataTypes.INTEGER, allowNull: true },
    attacking_heading_accuracy: { type: DataTypes.INTEGER, allowNull: true },
    attacking_short_passing: { type: DataTypes.INTEGER, allowNull: true },
    attacking_volleys: { type: DataTypes.INTEGER, allowNull: true },
    skill_dribbling: { type: DataTypes.INTEGER, allowNull: true },
    skill_curve: { type: DataTypes.INTEGER, allowNull: true },
    skill_fk_accuracy: { type: DataTypes.INTEGER, allowNull: true },
    skill_long_passing: { type: DataTypes.INTEGER, allowNull: true },
    skill_ball_control: { type: DataTypes.INTEGER, allowNull: true },
    movement_acceleration: { type: DataTypes.INTEGER, allowNull: true },
    movement_sprint_speed: { type: DataTypes.INTEGER, allowNull: true },
    movement_agility: { type: DataTypes.INTEGER, allowNull: true },
    movement_reactions: { type: DataTypes.INTEGER, allowNull: true },
    movement_balance: { type: DataTypes.INTEGER, allowNull: true },
    power_shot_power: { type: DataTypes.INTEGER, allowNull: true },
    power_jumping: { type: DataTypes.INTEGER, allowNull: true },
    power_stamina: { type: DataTypes.INTEGER, allowNull: true },
    power_strength: { type: DataTypes.INTEGER, allowNull: true },
    power_long_shots: { type: DataTypes.INTEGER, allowNull: true },
    mentality_aggression: { type: DataTypes.INTEGER, allowNull: true },
    mentality_interceptions: { type: DataTypes.INTEGER, allowNull: true },
    mentality_positioning: { type: DataTypes.INTEGER, allowNull: true },
    mentality_vision: { type: DataTypes.INTEGER, allowNull: true },
    mentality_penalties: { type: DataTypes.INTEGER, allowNull: true },
    mentality_composure: { type: DataTypes.INTEGER, allowNull: true },
    defending_marking: { type: DataTypes.INTEGER, allowNull: true },
    defending_standing_tackle: { type: DataTypes.INTEGER, allowNull: true },
    defending_sliding_tackle: { type: DataTypes.INTEGER, allowNull: true },
    goalkeeping_diving: { type: DataTypes.INTEGER, allowNull: true },
    goalkeeping_handling: { type: DataTypes.INTEGER, allowNull: true },
    goalkeeping_kicking: { type: DataTypes.INTEGER, allowNull: true },
    goalkeeping_positioning: { type: DataTypes.INTEGER, allowNull: true },
    goalkeeping_reflexes: { type: DataTypes.INTEGER, allowNull: true },
    goalkeeping_speed: { type: DataTypes.INTEGER, allowNull: true },
    player_face_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "players",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["player_id", "fifa_version"],
      },
    ],
  }
);

Player.validateFields = (fields) => {
  const validFields = Object.keys(Player.rawAttributes);
  const filteredFields = Object.keys(fields).reduce((acc, key) => {
    if (validFields.includes(key)) {
      acc[key] = fields[key];
    }
    return acc;
  }, {});

  return filteredFields;
};

module.exports = Player;

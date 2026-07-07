const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class TimeSlot extends Model {}

TimeSlot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    startTime: {
      type: DataTypes.TIME,
      field: 'start_time',
      allowNull: true,
    },
    endTime: {
      type: DataTypes.TIME,
      field: 'end_time',
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'TimeSlot',
    tableName: 'time_slot',
    timestamps: false,
  }
);

module.exports = TimeSlot;

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class PhysicalStateReport extends Model {}

PhysicalStateReport.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    observation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reportedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'PhysicalStateReport',
    tableName: 'physical_state_reports',
    timestamps: true,
  }
);

module.exports = PhysicalStateReport;

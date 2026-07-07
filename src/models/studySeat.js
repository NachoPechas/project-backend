const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class StudySeat extends Model {}

StudySeat.init({
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true,
    autoIncrement: true
  },
  status: { 
    type: DataTypes.STRING(50), 
    defaultValue: 'Disponible' 
  },
  location_details: { 
    type: DataTypes.TEXT 
  },
  computers: { 
    type: DataTypes.INTEGER 
  },
  tiempo_restante: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  } 
}, {
  sequelize,
  modelName: 'StudySeat',
  tableName: 'study_seat',
  timestamps: false
});

module.exports = StudySeat;

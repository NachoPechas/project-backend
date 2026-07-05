const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Usuario extends Model {}

Usuario.init(
{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100],
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true, 
    validate: {
      isEmail: true, 
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  // ── CAMBIO 1: Rol para la Biblioteca ──
  rol: {
    type: DataTypes.STRING(30),
    defaultValue: 'estudiante', // Por defecto todos entran como estudiantes
    allowNull: false
  },
  // ── CAMBIO 2: Para saber si se registró por Google/UNAL o manual ──
  proveedorAuth: {
    type: DataTypes.STRING(20),
    defaultValue: 'local', // 'local' para los rama main, 'google' mi rama
    allowNull: false
  }
},
{
  sequelize, 
  modelName: 'Usuario',
  tableName: 'usuarios', 
  timestamps: true, 
}
);

module.exports = Usuario;
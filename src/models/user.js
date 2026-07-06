const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3, // Por defecto entra como Estudiante (id: 3)
      references: {
        model: 'role', // Hace referencia a la tabla 'role' del init.sql
        key: 'id',
      }
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'Activo',
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    timestamps: false,
  }
);

module.exports = User;
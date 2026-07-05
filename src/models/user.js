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

    rol: {
      type: DataTypes.STRING(30),
      defaultValue: 'estudiante',
      allowNull: false
    },
    proveedorAuth: {
      type: DataTypes.STRING(20),
      defaultValue: 'local',
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
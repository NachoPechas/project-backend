const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
// Clase Usuario → tabla 'usuarios' en PostgreSQL
class Usuario extends Model {}
Usuario.init(
{
// id se genera automáticamente (PK autoincrement)
id: {
type: DataTypes.INTEGER,
primaryKey: true,
autoIncrement: true,
},
nombre: {
type: DataTypes.STRING(100),
allowNull: false, // campo obligatorio
validate: {
notEmpty: true,
len: [2, 100],
}
},
email: {
type: DataTypes.STRING(150),
allowNull: false,
unique: true, // no puede haber emails duplicados
validate: {
isEmail: true, // valida formato de email
}
},
activo: {
type: DataTypes.BOOLEAN,
defaultValue: true,
}
},
{
sequelize, // instancia de conexión
modelName: 'Usuario',
tableName: 'usuarios', // nombre real de la tabla en PostgreSQL
timestamps: true, // crea createdAt y updatedAt automáticamente
}
);
module.exports = Usuario;
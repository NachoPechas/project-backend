const { Sequelize } = require('sequelize');
// Instancia Sequelize con las variables de entorno de Docker / .env
const sequelize = new Sequelize({
dialect: 'postgres',
host: process.env.DB_HOST || 'localhost',
port: process.env.DB_PORT || 5432,
username: process.env.DB_USER || 'admin',
password: process.env.DB_PASSWORD || 'secreto123',
database: process.env.DB_NAME || 'hola_mundo_db',
logging: false, // true para ver SQL en consola (útil al depurar)
pool: {
max: 5, // conexiones máximas al pool
min: 0,
acquire: 30000,
idle: 10000
}
});
module.exports = sequelize;
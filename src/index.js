require('dotenv').config(); // carga variables del .env
const express = require('express');
const sequelize = require('./config/database');
require('./models/user'); // registrar modelo
const usuariosRouter = require('./routes/user');
const app = express();
const PORT = process.env.PORT || 3000;
// Middlewares globales
app.use(express.json()); // parsear JSON en el body
app.use(express.urlencoded({ extended: true }));
// CORS básico (para conectar con Angular en desarrollo)
app.use((req, res, next) => {
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
if (req.method === 'OPTIONS') return res.sendStatus(200);
next();
});
// ■■ Ruta de salud (Hola Mundo) ■■
app.get('/', (req, res) => {
res.json({
mensaje: '¡Hola Mundo! API funcionando correctamente',
version: '1.0.0',
timestamp: new Date().toISOString()
});
});
// ■■ Rutas de la API ■■
app.use('/api/usuarios', usuariosRouter);
// ■■ Arranque: conectar BD → sincronizar modelos → levantar servidor ■■
async function iniciar() {
  try {
await sequelize.authenticate();
console.log('■ Conexión a PostgreSQL exitosa');
// sync({ force: false }) crea la tabla si no existe, no borra datos
await sequelize.sync({ force: false });
console.log('■ Modelos sincronizados con la BD');
app.listen(PORT, () => {
console.log(`■ Servidor corriendo en http://localhost:${PORT}`);
});
} catch (error) {
console.error('■ Error al iniciar:', error.message);
process.exit(1);
} }
iniciar();
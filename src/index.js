require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const models = require('./models');
const usuariosRouter = require('./routes/user');
const booksRouter = require('./routes/book');
const itemsRouter = require('./routes/item');
const studySeatsRouter = require('./routes/studySeat');
const seatReservationsRouter = require('./routes/seatReservation');
const authRouter = require('./routes/auth');
const notificationsRouter = require('./routes/notification');
const notificationService = require('./services/notificationService');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/', (req, res) => {
  res.json({
    mensaje: '¡Hola Mundo! API funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/usuarios', usuariosRouter);
app.use('/api/libros', booksRouter);
app.use('/api/ejemplares', itemsRouter);
app.use('/api/puestos', studySeatsRouter);
app.use('/api/reservas-puestos', seatReservationsRouter);
app.use('/api/auth', authRouter);
app.use('/api/notificaciones', notificationsRouter);

async function iniciar() {
  try {
    await sequelize.authenticate();
    console.log('■ Conexión a PostgreSQL exitosa');
    await sequelize.sync({ force: false });
    console.log('■ Modelos sincronizados con la BD');
    notificationService.createDueDateNotifications().catch((error) => {
      console.error('Error al generar notificaciones de vencimiento:', error.message);
    });
    notificationService.createOverdueNotifications().catch((error) => {
      console.error('Error al generar notificaciones de retraso:', error.message);
    });

    setInterval(() => {
      notificationService.createDueDateNotifications().catch((error) => {
        console.error('Error al generar notificaciones de vencimiento:', error.message);
      });
      notificationService.createOverdueNotifications().catch((error) => {
        console.error('Error al generar notificaciones de retraso:', error.message);
      });
    }, 24 * 60 * 60 * 1000);

    app.listen(PORT, () => {
      console.log(`■ Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('■ Error al iniciar:', error.message);
    process.exit(1);
  }
}

iniciar();

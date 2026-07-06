require('dotenv').config();

const sequelize = require('./src/config/database'); 
const { agendarPuesto } = require('./src/services/reservationService');

async function correrPrueba() {
  try {
    // 1. Conectar a la Base de Datos antes de la prueba
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida.');

    // ==========================================
    // ESCENARIO 1: Reserva Exitosa
    // ==========================================
    // Usamos el puesto 1 (Piso 1 - A1) que en el seed está Disponible (tiempo_restante 0)
    const test1 = await agendarPuesto(
      1,     // userId (Tomás Angarita)
      1,     // seatId (Disponible: Piso 1 - A1)
      1,     // slotId (08:00 - 10:00)
      60     // tiempoX (Le asignamos 60 minutos)
    );
    console.log('Resultado del código:', test1);


    // ==========================================
    // ESCENARIO 2: Intento de Reserva Fallido (Puesto Ocupado)
    // ==========================================
    // Usamos el puesto 4 (Piso 2 - B2) que en tu seed ya está 'Ocupado' con 45 min restantes
    const test2 = await agendarPuesto(
      4,     // userId (María Pérez)
      4,     // seatId (Ocupado: Piso 2 - B2)
      2,     // slotId
      30     // tiempoX
    );
    console.log('Resultado del código:', test2);


    // ==========================================
    // ESCENARIO 3: Intento de Reserva Fallido (No Existe)
    // ==========================================
    // Buscamos un ID que no esté en tus inserts del seed
    const test3 = await agendarPuesto(
      1,     // userId
      999,   // seatId (No existe)
      1,     // slotId
      45     // tiempoX
    );
    console.log('Resultado del código:', test3);

  } catch (error) {
    console.error('❌ Error ejecutando el script de pruebas:', error);
  } finally {
    // Cerrar la conexión limpia al terminar para que no se quede colgado el script
    await sequelize.close();
    console.log('\n🔒 Conexión de base de datos cerrada. Prueba finalizada.');
  }
}

correrPrueba();
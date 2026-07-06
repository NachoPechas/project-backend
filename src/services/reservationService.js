const StudySeat = require('../models/studySeat');
const SeatReservation = require('../models/seatReservation');

/**
 * Agendar un puesto de estudio para un estudiante
 * @param {number} userId
 * @param {number} seatId 
 * @param {number} slotId 
 * @param {number} tiempoX 
 */
async function agendarPuesto(userId, seatId, slotId, tiempoX) {
  try {
    //prints para verificar, borrar despues todo bien
    console.log(`\n=== 📥 INTENTO DE RESERVA ===`);
    console.log(`Buscando disponibilidad para el Puesto ID: ${seatId}...`);

    const puesto = await StudySeat.findByPk(seatId);

    if (!puesto) {
      //otro print
      console.log(`❌ ERROR: El puesto con ID ${seatId} no existe en la base de datos.`);
      return { success: false, message: `El puesto con ID ${seatId} no existe.` };
    }

    if (puesto.tiempo_restante > 0 || puesto.status === 'Ocupado') {
      //printsitos
      console.log(`⚠️ ALERTA: Intento de reserva fallido. El puesto ${seatId} ya está ocupado.`);
      console.log(`Estado actual: ${puesto.status} | Tiempo que le queda: ${puesto.tiempo_restante} minutos.`);
      return { 
        success: false, 
        message: `⚠️ El puesto ${seatId} ya está ocupado. Tiempo restante: ${puesto.tiempo_restante} minutos.` 
      };
    }

    await SeatReservation.create({
      user_id: userId,
      seat_id: seatId,
      slot_id: slotId,
      status: 'Activa'
    });

    puesto.tiempo_restante = tiempoX;
    puesto.status = 'Ocupado';
    await puesto.save();

    return { 
      success: true, 
      message: `✅ Reserva confirmada en el puesto ${seatId} por ${tiempoX} minutes.` 
    };

  } catch (error) {
    console.error("Error al agendar el puesto:", error);
    return { success: false, message: "Error interno del servidor al procesar la reserva." };
  }
}

/**
 * 
 */
async function actualizarContadoresTiempo() {
  try {
    const puestosOcupados = await StudySeat.findAll({
      where: {
        status: 'Ocupado'
      }
    });

    for (let puesto of puestosOcupados) {
      if (puesto.tiempo_restante > 0) {
        puesto.tiempo_restante -= 1; 
      }

      if (puesto.tiempo_restante === 0) {
        puesto.status = 'Disponible';
        
        await SeatReservation.update(
          { status: 'Finalizada' },
          { where: { seat_id: puesto.id, status: 'Activa' } }
        );
      }

      await puesto.save();
    }
  } catch (error) {
    console.error("Error actualizando los contadores de los puestos:", error);
  }
}

module.exports = {
  agendarPuesto,
  actualizarContadoresTiempo
};
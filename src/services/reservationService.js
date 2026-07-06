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
    // ── PRINT DE INICIO ──
    console.log(`\n=== 📥 INTENTO DE RESERVA ===`);
    console.log(`Buscando disponibilidad para el Puesto ID: ${seatId}...`);

    const puesto = await StudySeat.findByPk(seatId);

    if (!puesto) {
      // ── PRINT DE ERROR: NO EXISTE ──
      console.log(`❌ ERROR: El puesto con ID ${seatId} no existe en la base de datos.`);
      return { success: false, message: `El puesto con ID ${seatId} no existe.` };
    }

    if (puesto.tiempo_restante > 0 || puesto.status === 'Ocupado') {
      // ── PRINT DE ERROR: OCUPADO ──
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

    // ── PRINT DE ÉXITO ──
    console.log(`\n==================================================`);
    console.log(`✅ ¡ÉXITO! El asiento ha sido reservado correctamente.`);
    console.log(`• Reservado por el Usuario ID: ${userId}`);
    console.log(`• Puesto de Estudio ID: ${puesto.id}`);
    console.log(`• Bloque de tiempo (Slot ID): ${slotId}`);
    console.log(`• Tiempo asignado: ${puesto.tiempo_restante} minutos.`);
    console.log(`==================================================\n`);

    return { 
      success: true, 
      message: `✅ Reserva confirmada en el puesto ${seatId} por ${tiempoX} minutos.` 
    };

  } catch (error) {
    console.error("❌ Error al agendar el puesto:", error);
    return { success: false, message: "Error interno del servidor al procesar la reserva." };
  }
}

/**
 * Reduce los contadores de tiempo de los puestos ocupados
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
          { where: { seat_id: puestosOcupados.id, status: 'Activa' } }
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

// =========================================================================
// 🚀 PRUEBA DE EJECUCIÓN MANUAL (BORRAR O COMENTAR ANTES DE SUBIR A GIT)
// =========================================================================
// Forzamos a que corra la función una vez de manera aislada para ver los logs
(async () => {
  console.log("Iniciando prueba rápida del servicio...");
  // Parámetros ficticios: userId = 10, seatId = 1, slotId = 2, tiempoX = 45 minutos
  await agendarPuesto(10, 1, 2, 45);
})();
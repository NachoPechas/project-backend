const test = require('node:test');
const assert = require('node:assert/strict');
const { agendarPuesto } = require('../src/services/reservationService');

test('agendarPuesto confirma una reserva si el puesto está disponible', async () => {
  const seat = {
    id: 1,
    status: 'Disponible',
    tiempo_restante: 0,
    save: async function () {
      return this;
    },
  };

  const result = await agendarPuesto(7, 1, 3, 20, {
    StudySeat: {
      findByPk: async () => seat,
    },
    SeatReservation: {
      create: async (data) => data,
    },
  });

  assert.equal(result.success, true);
  assert.equal(seat.status, 'Ocupado');
  assert.equal(seat.tiempo_restante, 20);
});

test('agendarPuesto rechaza una reserva si el puesto ya está ocupado', async () => {
  const seat = {
    id: 2,
    status: 'Ocupado',
    tiempo_restante: 15,
  };

  const result = await agendarPuesto(8, 2, 4, 30, {
    StudySeat: {
      findByPk: async () => seat,
    },
    SeatReservation: {
      create: async () => ({ ok: true }),
    },
  });

  assert.equal(result.success, false);
  assert.match(result.message, /ocupado/i);
});

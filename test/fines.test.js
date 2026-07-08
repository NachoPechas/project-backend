const test = require('node:test');
const assert = require('node:assert/strict');
const { Book, Item, User, Loan } = require('../src/models');
const fineService = require('../src/services/fineService');

test('applyFine marca un préstamo vencido como sancionado', async () => {
  const user = await User.create({ nombre: 'Estudiante multa', email: 'multa@test.com', roleId: 3, status: 'Activo' });
  const book = await Book.create({ title: 'Libro multa', author: 'Autor multa', category: 'Historia', publicationYear: 2024 });
  const item = await Item.create({ code: 'EJ-FINE-01', bookId: book.id, status: 'en_prestamo', location: 'Estante F' });
  const loan = await Loan.create({ userId: user.id, itemId: item.id, loanDate: '2026-06-20', dueDate: '2026-06-27', status: 'activo' });

  const fine = await fineService.applyFine(loan.id, { amount: 5000, reason: 'Préstamo vencido' });

  assert.equal(fine.status, 'vencido');
  assert.equal(fine.fineApplied, '5000.00');

  await Loan.destroy({ where: { id: loan.id } });
  await Item.destroy({ where: { id: item.id } });
  await Book.destroy({ where: { id: book.id } });
  await User.destroy({ where: { id: user.id } });
});

test('applyFine rechaza una sanción si el préstamo no existe', async () => {
  await assert.rejects(
    () => fineService.applyFine(999999, { amount: 5000, reason: 'Préstamo vencido' }),
    /no existe/
  );
});

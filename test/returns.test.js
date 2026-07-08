const test = require('node:test');
const assert = require('node:assert/strict');
const { Book, Item, User, Loan } = require('../src/models');
const returnService = require('../src/services/returnService');

test('returnLoan marca el préstamo como devuelto y libera el ejemplar', async () => {
  const user = await User.create({ nombre: 'Estudiante retorno', email: 'retorno@test.com', roleId: 3, status: 'Activo' });
  const book = await Book.create({ title: 'Libro retorno', author: 'Autor retorno', category: 'Historia', publicationYear: 2024 });
  const item = await Item.create({ code: 'EJ-RETURN-01', bookId: book.id, status: 'en_prestamo', location: 'Estante E' });
  const loan = await Loan.create({ userId: user.id, itemId: item.id, loanDate: '2026-07-01', dueDate: '2026-07-08', status: 'activo' });

  const returned = await returnService.returnLoan(loan.id, { returnDate: '2026-07-07' });

  assert.equal(returned.status, 'devuelto');
  assert.equal(returned.returnDate, '2026-07-07');

  const updatedItem = await Item.findByPk(item.id);
  assert.equal(updatedItem.status, 'disponible');

  await Loan.destroy({ where: { id: loan.id } });
  await Item.destroy({ where: { id: item.id } });
  await Book.destroy({ where: { id: book.id } });
  await User.destroy({ where: { id: user.id } });
});

test('returnLoan rechaza una devolución si el préstamo no existe', async () => {
  await assert.rejects(
    () => returnService.returnLoan(999999, { returnDate: '2026-07-07' }),
    /no existe/
  );
});

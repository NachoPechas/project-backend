const test = require('node:test');
const assert = require('node:assert/strict');
const { Book, Item, User, Loan } = require('../src/models');
const loanService = require('../src/services/loanService');

test('createLoan crea un préstamo cuando el ejemplar está disponible', async () => {
  const user = await User.create({ nombre: 'Estudiante prueba', email: 'estudiante@test.com', roleId: 3, status: 'Activo' });
  const book = await Book.create({ title: 'Libro préstamo', author: 'Autor préstamo', category: 'Historia', publicationYear: 2024 });
  const item = await Item.create({ code: 'EJ-LOAN-01', bookId: book.id, status: 'disponible', location: 'Estante C' });

  const loan = await loanService.createLoan({
    userId: user.id,
    itemId: item.id,
    loanDate: '2026-07-07',
    dueDate: '2026-07-14',
  });

  assert.ok(loan.id);
  assert.equal(loan.status, 'activo');
  assert.equal(loan.userId, user.id);
  assert.equal(loan.itemId, item.id);

  await Loan.destroy({ where: { id: loan.id } });
  await Item.destroy({ where: { id: item.id } });
  await Book.destroy({ where: { id: book.id } });
  await User.destroy({ where: { id: user.id } });
});

test('createLoan rechaza un préstamo si el ejemplar no está disponible', async () => {
  const user = await User.create({ nombre: 'Estudiante prueba 2', email: 'estudiante2@test.com', roleId: 3, status: 'Activo' });
  const book = await Book.create({ title: 'Libro no disponible', author: 'Autor no disponible', category: 'Tecnología', publicationYear: 2024 });
  const item = await Item.create({ code: 'EJ-LOAN-02', bookId: book.id, status: 'en_prestamo', location: 'Estante D' });

  await assert.rejects(
    () => loanService.createLoan({
      userId: user.id,
      itemId: item.id,
      loanDate: '2026-07-07',
      dueDate: '2026-07-14',
    }),
    /no está disponible/
  );

  await Item.destroy({ where: { id: item.id } });
  await Book.destroy({ where: { id: book.id } });
  await User.destroy({ where: { id: user.id } });
});

const { Loan, Item, User } = require('../models');

async function createLoan(data) {
  const item = await Item.findByPk(data.itemId);
  if (!item) {
    throw new Error('El ejemplar no existe');
  }

  if (item.status !== 'disponible') {
    throw new Error('El ejemplar no está disponible para préstamo');
  }

  const user = await User.findByPk(data.userId);
  if (!user) {
    throw new Error('El usuario no existe');
  }

  const loan = await Loan.create({
    userId: data.userId,
    itemId: data.itemId,
    loanDate: data.loanDate,
    dueDate: data.dueDate,
    status: 'activo',
  });

  await item.update({ status: 'en_prestamo' });

  return loan;
}

module.exports = {
  createLoan,
};

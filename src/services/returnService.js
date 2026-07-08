const { Loan, Item } = require('../models');

async function returnLoan(loanId, data = {}) {
  const loan = await Loan.findByPk(loanId);
  if (!loan) {
    throw new Error('El préstamo no existe');
  }

  if (loan.status === 'devuelto') {
    throw new Error('El préstamo ya fue devuelto');
  }

  const item = await Item.findByPk(loan.itemId);
  if (!item) {
    throw new Error('El ejemplar asociado no existe');
  }

  await loan.update({
    status: 'devuelto',
    returnDate: data.returnDate || new Date().toISOString().slice(0, 10),
  });

  await item.update({ status: 'disponible' });

  return loan;
}

module.exports = {
  returnLoan,
};

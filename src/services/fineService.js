const { Loan } = require('../models');

async function applyFine(loanId, data = {}) {
  const loan = await Loan.findByPk(loanId);
  if (!loan) {
    throw new Error('El préstamo no existe');
  }

  const today = new Date();
  const dueDate = new Date(loan.dueDate);
  const isOverdue = today > dueDate;

  if (!isOverdue) {
    throw new Error('El préstamo no está vencido');
  }

  await loan.update({
    status: 'vencido',
    fineApplied: data.amount || 0,
  });

  return loan;
}

module.exports = {
  applyFine,
};

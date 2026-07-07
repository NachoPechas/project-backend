const Loan = require('../models/loan');

class LoanRepository {
    async create(loanData) {
        return await Loan.create(loanData);
    }
}
module.exports = new LoanRepository();
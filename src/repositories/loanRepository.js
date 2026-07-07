const Loan = require('../models/loan');
const Item = require('../models/item'); 
const Book = require('../models/book'); 

class LoanRepository {
    async create(loanData) {
        return await Loan.create(loanData);
    }

    async findByUserId(userId) {
        return await Loan.findAll({
            where: { user_id: userId },
            order: [['loan_date', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['physical_condition', 'availability_status'],
                    include: [
                        {
                            model: Book,
                            attributes: ['title', 'author', 'category']
                        }
                    ]
                }
            ]
        });
    }
}
module.exports = new LoanRepository();
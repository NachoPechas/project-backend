const Penalty = require('../models/penalty');
const User = require('../models/user');
const Loan = require('../models/loan');

class PenaltyRepository {s
    async findAllPenalties() {
        return await Penalty.findAll({
            order: [['created_date', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Loan,
                    attributes: ['id', 'loan_date', 'due_date']
                }
            ]
        });
    }
}

module.exports = new PenaltyRepository();
const Penalty = require('../models/penalty');
const User = require('../models/user');
const Loan = require('../models/loan');




Penalty.belongsTo(User, { foreignKey: 'user_id' });
Penalty.belongsTo(Loan, { foreignKey: 'loan_id' }); 

class PenaltyRepository {
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
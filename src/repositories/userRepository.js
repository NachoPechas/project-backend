const User = require('../models/user');

class UserRepository {
    async findByEmail(email) {
        return await User.findOne({
            where: { email: email }
        });
    }

    async create(userData) {
        return await User.create(userData);
    }

    async update(id, updateData) {
        return await User.update(updateData, {
            where: { id: id }
        });
    }
}

module.exports = new UserRepository();
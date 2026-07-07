const Item = require('../models/item');

class ItemRepository {
    async findById(id) {
        return await Item.findByPk(id);
    }

    async update(id, updateData) {
        return await Item.update(updateData, { where: { id } });
    }
}
module.exports = new ItemRepository();
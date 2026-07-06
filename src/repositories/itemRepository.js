const Item = require('../models/item');
const Book = require('../models/book');

class ItemRepository {
  async findById(id) {
    return Item.findByPk(id, {
      include: [{ model: Book, as: 'book', attributes: ['title', 'author'] }]
    });
  }
}

module.exports = new ItemRepository();
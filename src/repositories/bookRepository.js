const Book = require('../models/book');

class BookRepository {
    async find(conditions = {}) {
        return Book.findAll({
            where: conditions,
            order: [['title', 'ASC']]
        });
    }
}

module.exports = new BookRepository();
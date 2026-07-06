const { Op } = require('sequelize');
const bookRepository = require('../repositories/bookRepository');

class BookService {
    async searchCatalog(filters) {
        const conditions = this.#buildSearchConditions(filters);
        return bookRepository.find(conditions);
    }

    #buildSearchConditions({ title, author, category }) {
        const conditions = {};

        if (title) {
            conditions.title = { [Op.iLike]: `%${title.trim()}%` };
        }
        if (author) {
            conditions.author = { [Op.iLike]: `%${author.trim()}%` };
        }
        if (category) {
            conditions.category = { [Op.iLike]: `%${category.trim()}%` };
        }

        return conditions;
    }
}

module.exports = new BookService();
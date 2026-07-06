const { Op } = require('sequelize');
const bookRepository = require('../repositories/bookRepository');

class BookService {
    async searchCatalog(filters, roleId) {
        const allowedRoles = [2, 3];
        if (!allowedRoles.includes(Number(roleId))) {
            const error = new Error('Acceso denegado. No tienes permisos para buscar libros.');
            error.status = 403;
            throw error;
        }

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
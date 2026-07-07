const { Op } = require('sequelize');
const { Book } = require('../models');

async function createBook(data) {
  return Book.create({
    title: data.title,
    author: data.author,
    category: data.category,
    publicationYear: data.publicationYear,
  });
}

async function listBooks() {
  return Book.findAll({ order: [['title', 'ASC']] });
}

async function searchCatalog(filters = {}) {
  const where = {};

  if (filters.title) {
    where.title = { [Op.iLike]: `%${String(filters.title).trim()}%` };
  }

  if (filters.author) {
    where.author = { [Op.iLike]: `%${String(filters.author).trim()}%` };
  }

  if (filters.category) {
    where.category = { [Op.iLike]: `%${String(filters.category).trim()}%` };
  }

  return Book.findAll({
    where,
    order: [['title', 'ASC']],
  });
}

async function getBookById(id) {
  return Book.findByPk(id);
}

module.exports = {
  createBook,
  listBooks,
  searchCatalog,
  getBookById,
};

const { Book } = require('../models');

async function createBook(data) {
  return Book.create({
    title: data.title,
    author: data.author,
    category: data.category,
    publicationYear: data.publicationYear,
    description: data.description,
  });
}

async function listBooks() {
  return Book.findAll({ order: [['createdAt', 'DESC']] });
}

async function getBookById(id) {
  return Book.findByPk(id);
}

module.exports = {
  createBook,
  listBooks,
  getBookById,
};

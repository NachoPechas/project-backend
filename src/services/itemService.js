const { Item } = require('../models');

async function createItem(data) {
  return Item.create({
    code: data.code,
    bookId: data.bookId,
    status: data.status || 'disponible',
    location: data.location,
    physicalCondition: data.physicalCondition || 'buen_estado',
  });
}

async function listItemsByBook(bookId) {
  return Item.findAll({
    where: { bookId },
    order: [['createdAt', 'DESC']],
  });
}

module.exports = {
  createItem,
  listItemsByBook,
};

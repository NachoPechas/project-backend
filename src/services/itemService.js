const { Op } = require('sequelize');
const { Book, Item } = require('../models');

async function createItem(data) {
  return Item.create({
    bookId: data.bookId,
    description: data.description,
    status: data.status || 'Disponible',
    physicalCondition: data.physicalCondition || 'Bueno',
  });
}

async function listItemsByBook(bookId) {
  return Item.findAll({
    where: { bookId },
    order: [['id', 'ASC']],
  });
}

async function listItems() {
  return Item.findAll({
    order: [['id', 'ASC']],
    include: [
      {
        model: Book,
        as: 'book',
        attributes: ['id', 'title', 'author', 'category'],
      },
    ],
  });
}

async function getStatusByIdentifier(identifier) {
  const value = String(identifier).trim();

  if (!Number.isInteger(Number(value))) {
    return null;
  }

  return Item.findOne({
    where: { id: Number(value) },
    attributes: ['id', 'bookId', 'description', 'status', 'physicalCondition'],
  });
}

function requiresMaintenance(physicalCondition) {
  const normalizedCondition = String(physicalCondition)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return ['danado', 'malo', 'roto', 'deteriorado'].some((word) =>
    normalizedCondition.includes(word)
  );
}

async function updatePhysicalCondition(identifier, physicalCondition) {
  const value = String(identifier).trim();

  if (!Number.isInteger(Number(value))) {
    return null;
  }

  const item = await Item.findOne({ where: { id: Number(value) } });

  if (!item) {
    return null;
  }

  item.physicalCondition = physicalCondition;

  if (requiresMaintenance(physicalCondition)) {
    item.status = 'Mantenimiento';
  }

  await item.save();

  return item;
}

module.exports = {
  createItem,
  listItems,
  listItemsByBook,
  getStatusByIdentifier,
  updatePhysicalCondition,
};

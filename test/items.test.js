const test = require('node:test');
const assert = require('node:assert/strict');
const { Book, Item } = require('../src/models');
const itemService = require('../src/services/itemService');

test('createItem crea un ejemplar asociado a un libro', async () => {
  const book = await Book.create({
    title: 'Libro para ejemplar',
    author: 'Autor ejemplar',
    category: 'Ciencia',
    publicationYear: 2025,
  });

  const created = await itemService.createItem({
    code: 'EJ-00001',
    bookId: book.id,
    status: 'disponible',
    location: 'Estante A',
    physicalCondition: 'buen_estado',
  });

  assert.ok(created.id);
  assert.equal(created.code, 'EJ-00001');
  assert.equal(created.bookId, book.id);

  await Item.destroy({ where: { id: created.id } });
  await Book.destroy({ where: { id: book.id } });
});

test('listItems devuelve ejemplares por libro', async () => {
  const book = await Book.create({
    title: 'Libro para listar ejemplares',
    author: 'Autor listado',
    category: 'Matemáticas',
    publicationYear: 2022,
  });

  await itemService.createItem({
    code: 'EJ-00002',
    bookId: book.id,
    status: 'disponible',
    location: 'Estante B',
  });

  const items = await itemService.listItemsByBook(book.id);

  assert.ok(items.length >= 1);
  assert.equal(items[0].bookId, book.id);

  await Item.destroy({ where: { bookId: book.id } });
  await Book.destroy({ where: { id: book.id } });
});

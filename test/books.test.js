const test = require('node:test');
const assert = require('node:assert/strict');
const { Book } = require('../src/models');
const bookService = require('../src/services/bookService');

test('createBook persiste un libro con datos básicos', async () => {
  const created = await bookService.createBook({
    title: 'Libro de prueba',
    author: 'Autor de prueba',
    category: 'Tecnología',
    publicationYear: 2024,
    description: 'Prueba de creación de libro',
  });

  assert.ok(created.id);
  assert.equal(created.title, 'Libro de prueba');
  await Book.destroy({ where: { id: created.id } });
});

test('listBooks y getBookById devuelven libros persistidos', async () => {
  const created = await bookService.createBook({
    title: 'Libro de consulta',
    author: 'Autor consulta',
    category: 'Historia',
    publicationYear: 2023,
  });

  const allBooks = await bookService.listBooks();
  const found = await bookService.getBookById(created.id);

  assert.ok(allBooks.length >= 1);
  assert.ok(found);
  assert.equal(found.title, 'Libro de consulta');

  await Book.destroy({ where: { id: created.id } });
});

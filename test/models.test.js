const test = require('node:test');
const assert = require('node:assert/strict');

const { sequelize, User, Role, Book, Item, Loan } = require('../src/models');

test('la base de modelos del dominio queda registrada correctamente', () => {
  assert.ok(sequelize);
  assert.ok(User);
  assert.ok(Role);
  assert.ok(Book);
  assert.ok(Item);
  assert.ok(Loan);
});

test('los modelos exponen asociaciones básicas del dominio', () => {
  assert.ok(User.associations.Role || User.associations.role);
  assert.ok(Book.associations.Items || Book.associations.items);
  assert.ok(Item.associations.Loans || Item.associations.loans);
  assert.ok(Loan.associations.User || Loan.associations.user);
});

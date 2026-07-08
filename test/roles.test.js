const test = require('node:test');
const assert = require('node:assert/strict');
const { createRole, deleteRole } = require('../src/services/roleService');

test('createRole crea un rol con permisos básicos y sin duplicados', async () => {
  const createdRoles = [];
  const roleModel = {
    findOne: async () => null,
    create: async (data) => {
      createdRoles.push(data);
      return { id: 10, ...data };
    },
  };

  const role = await createRole({ name: 'Bibliotecario', permissions: ['prestamos'] }, { Role: roleModel });

  assert.equal(role.id, 10);
  assert.equal(createdRoles[0].name, 'Bibliotecario');
  assert.deepEqual(createdRoles[0].permissions, ['prestamos']);
});

test('deleteRole rechaza eliminar un rol que sigue asignado a usuarios', async () => {
  const role = { id: 4, destroy: async () => true };
  const userModel = {
    count: async () => 2,
  };

  await assert.rejects(
    () => deleteRole(4, { Role: { findByPk: async () => role }, User: userModel }),
    /usuarios activos/i
  );
});

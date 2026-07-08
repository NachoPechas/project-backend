const Role = require('../models/role');
const User = require('../models/user');

async function createRole(data, injectedModels = {}) {
  const { Role: RoleModel = Role } = injectedModels;

  const existing = await RoleModel.findOne({ where: { name: data.name } });
  if (existing) {
    throw new Error('Ya existe un rol con ese nombre');
  }

  return RoleModel.create({
    name: data.name,
    description: data.description || '',
    permissions: data.permissions || [],
  });
}

async function deleteRole(roleId, injectedModels = {}) {
  const { Role: RoleModel = Role, User: UserModel = User } = injectedModels;
  const role = await RoleModel.findByPk(roleId);

  if (!role) {
    throw new Error('El rol no existe');
  }

  const activeUsers = await UserModel.count({ where: { roleId: roleId } });
  if (activeUsers > 0) {
    throw new Error('No se puede eliminar un rol con usuarios activos asignados');
  }

  await role.destroy();
  return { success: true };
}

module.exports = {
  createRole,
  deleteRole,
};

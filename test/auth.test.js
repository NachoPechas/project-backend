const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { verifyToken, isLibraryStaff } = require('../src/middleware/authMiddleware');
const { buildUserDataFromGooglePayload } = require('../src/routes/auth');

function createResponse() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('buildUserDataFromGooglePayload mapea el nombre y rol a campos del modelo', () => {
  const payload = buildUserDataFromGooglePayload({
    email: 'estudiante@unal.edu.co',
    name: 'Ana Torres',
  }, 3);

  assert.deepEqual(payload, {
    nombre: 'Ana Torres',
    email: 'estudiante@unal.edu.co',
    roleId: 3,
    status: 'Activo',
  });
});

test('verifyToken rechaza peticiones sin token', () => {
  const req = { headers: {} };
  const res = createResponse();
  let nextCalled = false;

  verifyToken(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test('verifyToken permite peticiones con token válido y carga el usuario', () => {
  const token = jwt.sign({ id: 1, roleId: 2, email: 'biblio@unal.edu.co' }, 'secreto_para_la_biblioteca_123');
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = createResponse();
  let nextCalled = false;

  verifyToken(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.user.roleId, 2);
  assert.equal(res.statusCode, null);
});

test('isLibraryStaff solo deja pasar bibliotecarios o administradores', () => {
  const allowedReq = { user: { roleId: 2 } };
  const deniedReq = { user: { roleId: 3 } };
  const allowedRes = createResponse();
  const deniedRes = createResponse();
  let allowedCalled = false;
  let deniedCalled = false;

  isLibraryStaff(allowedReq, allowedRes, () => {
    allowedCalled = true;
  });

  isLibraryStaff(deniedReq, deniedRes, () => {
    deniedCalled = true;
  });

  assert.equal(allowedCalled, true);
  assert.equal(deniedCalled, false);
  assert.equal(deniedRes.statusCode, 403);
});

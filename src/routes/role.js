const express = require('express');
const router = express.Router();
const roleService = require('../services/roleService');

router.post('/', async (req, res) => {
  try {
    const role = await roleService.createRole(req.body);
    res.status(201).json({ ok: true, data: role });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await roleService.deleteRole(req.params.id);
    res.json({ ok: true, data: result });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

module.exports = router;

const express = require('express');
const {createRole, updateRole, getRoles, deleteRole } = require('../Controller/RoleController');
const router = express.Router();

router.get('/role', getRoles);
router.post('/role', createRole);
router.put('/role', updateRole);
router.post('/rm-role', deleteRole);

module.exports = router;
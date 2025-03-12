const express = require('express');
const router = express.Router();

router.post('/member', createMemeber);
router.put('/member', updateMember);
router.get('/member', listMembers);
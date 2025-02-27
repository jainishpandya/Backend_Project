const express = require('express');
const { createClub, listClubs } = require('../Controller/ClubController');
const router = express.Router();

router.post('/create_club', createClub);
router.get('/listclub', listClubs);

module.exports = router;

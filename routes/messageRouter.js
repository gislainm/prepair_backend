"use strict";
/*eslint-disable */
const express = require('express');
const messageController = require('../controllers/messageController');
const router = express.Router();

router.post('/sendMessage', messageController.sendMessage);
router.get('/getMessages/:user1/:user2', messageController.getMessages);
router.get('/getRooms/:user_id', messageController.getCurrentUserRooms);

module.exports = router;
"use strict";
/*eslint-disable */
const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.get('/getMentors/:discipline', userController.getMentors);
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.put('/updateUserInfo',userController.updateUserInfo);
router.put('/updateUserPwd',userController.updateUserPwd);
router.get('/getAll',userController.getAllUser);

module.exports = router;
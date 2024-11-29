const express = require('express');
const route = express.Router();
const authController = require('../app/controllers/authController');

route.post('/login', authController.login);
route.post('/register', authController.register);
route.get('/', authController.auth);

module.exports = route;
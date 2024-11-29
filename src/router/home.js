const express = require('express');
const route = express.Router();
const homeController = require('../app/controllers/homeController');
route.get('/', homeController.home);

module.exports = route;
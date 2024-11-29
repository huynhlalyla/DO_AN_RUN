const express = require('express');
const route = express.Router();
const app = express();
const {adminRule} = require('../../config/ruleRoute');

const adminController = require('../../app/controllers/admin/adminController');
//các route không cần kiểm tra phiên đăng nhập
route.get('/login', adminController.login);
route.post('/loginStored', adminController.loginStored);
//dùng middleware để kiểm tra phiên đăng nhập
route.use(adminRule);
route.get('/home', adminController.home);
route.get('/postManage', adminController.postManage);
route.delete('/postManage/:id', adminController.postDelete);
route.get('/userManage', adminController.userManage);



module.exports = route;
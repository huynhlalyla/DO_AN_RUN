const Admins = require('../../modals/Admins');
const Users = require('../../modals/Users');
const Posts = require('../../modals/Posts');
const {mongooseToObject} = require('../../../until/setUpDatabase');
const {multipleMongooseToObject} = require('../../../until/setUpDatabase');
const session = require('express-session');

class AdminController {
    //GET /admin/login
    login(req, res, next) {
        res.render('admin/login', {layout: 'authLayout'});
    }
    loginStored(req, res, next) {
        //nhận dữ liệu từ form
        const dataAdmin = req.body;
        Admins.findOne({
            name: dataAdmin.adminName, //name admin trong database
            password: dataAdmin.adminPassword //password admin trong database
        })
            .then(admin => {
                if (admin) {
                    //lưu thông tin admin vào session
                    req.session.admin = admin;
                    //chuyển hướng đến trang admin home
                    res.redirect('/admin/home');
                } else {
                    //chuyển hướng đến trang login nếu không tìm thấy admin
                    res.redirect('/admin/login');
                }
            })
            .catch(next);
    }

    //GET /admin/home
    home(req, res, next) {
        Promise.all([
            Posts.find({}),
            Users.find({})
        ])
        .then(([posts, users]) => {
            res.render('admin/home', {
                layout: 'adminLayout',
                posts: multipleMongooseToObject(posts),
                users: multipleMongooseToObject(users)
            });
        })
        .catch(next);
    }

    //GET /admin/postManage
    postManage(req, res, next) {
        Posts.find({})
            .then(posts => {
                res.render('admin/managePost', {
                    layout: 'adminLayout', 
                    posts: multipleMongooseToObject(posts)
                });
            })
            .catch(next);
    }
    //DELETE /admin/postManage/:id
    postDelete(req, res, next) {
        Posts.deleteOne({_id: req.params.id})
            .then(() => {
                res.redirect('back');
            })
            .catch(next);
    }

    //GET /admin/userManage
    userManage(req, res, next) {
        Users.find({})
            .then(users => {
                res.render('admin/manageUsers', {layout: 'adminLayout', users: multipleMongooseToObject(users)});
            })
            .catch(next);   
    }
}

module.exports = new AdminController;
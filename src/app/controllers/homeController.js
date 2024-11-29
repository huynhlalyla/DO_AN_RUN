const Posts = require('../modals/Posts');
const {multipleMongooseToObject} = require('../../until/setUpDatabase');
class HomeController {
    home(req, res) {
        Posts.find({})
            .then(posts => {
                res.render('home', {posts: multipleMongooseToObject(posts)});
                // res.json(posts);
            })
    }
}
module.exports = new HomeController;
const Post = require('../modals/Posts');

class PostController {
    post(req, res) {
        res.render('post');
    }

    upload(req, res) {
        const data = req.body;
        const fileUrl = req.file.path.replace(/^.*[\\\/]uploads[\\\/]/, 'uploads/');
        const post = new Post({
            postTitle: data.postTitle,
            postContent: data.postContent,
            file: fileUrl,
            author: req.session.user.userName,
        });
        post.save()
            .then(() => {
                res.redirect('/');
            })
            .catch(err => {
                res.json({ error: err });
            });
    }
}

module.exports = new PostController;
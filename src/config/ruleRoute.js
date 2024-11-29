module.exports = {
    userRule: (req, res, next) => {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/auth');
        }
    },
    adminRule: (req, res, next) => {
        if (req.session.admin) {
            next();
        } else {
            res.redirect('/admin/login');
        }
    },
}
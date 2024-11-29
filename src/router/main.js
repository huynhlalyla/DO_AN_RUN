const authRouter = require('./auth');
const homeRouter = require('./home');
const postRouter = require('./post');

// admin
const adminRouter = require('./admin/admin');
function Router(app) {
    // user
    app.use('/auth', authRouter);
    app.use('/post', postRouter);
    app.use('/', homeRouter);

    // admin
    app.use('/admin', adminRouter);


}
module.exports = Router;
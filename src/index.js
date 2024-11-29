const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { engine } = require('express-handlebars');
const router = require('./router/main');
const db = require('./config/dbconfig');
const methodOverride = require('method-override');
const session = require('express-session');

// body parser
app.use(express.urlencoded({
    extended: true
}));

//sử dụng method ảo
app.use(methodOverride('_method'));
// Cấu hình session
app.use(session({
    secret: 'your_secret_key', // Thay thế bằng khóa bí mật của bạn
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Đặt thành true nếu bạn sử dụng HTTPS
}));


// tích hợp template engine handlebars
app.engine('.hbs', engine({
    extname: '.hbs',
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'Resources/views'));

//public cac file css
app.use(express.static(path.join(__dirname, 'public')));
const test = path.join(__dirname, 'public');

//dung cac router
router(app);

//connect db
db.connect();

app.listen(port, () => {
    console.log(`http://localhost:3000`);
})
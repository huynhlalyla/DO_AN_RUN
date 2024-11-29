const express = require('express');
const app = express();
const route = express.Router();
const multer = require('multer');
const {userRule} = require('../config/ruleRoute');
// Import controller
const postController = require('../app/controllers/postController');

// Cấu hình nơi lưu trữ và tên file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/uploads/'); // Thư mục lưu trữ file
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Tên file
    }
});

// Khởi tạo multer với cấu hình đã tạo
const upload = multer({ storage: storage });

route.use(userRule);
// Sử dụng middleware upload.single('file') để xử lý file upload
route.post('/upload', upload.single('file'), postController.upload);
route.get('/', postController.post);



module.exports = route;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    author: {type: String},
    postTitle: {type: String},
    postContent: {type: String},
    industryName: {type: String},
    file: {type: String},
    video: {type: String},
    date: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Post', Post);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userPassword: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'locked'],
        default: 'active'
    },
    fileCount: {
        type: Number,
        default: 0
    },
    videoCount: {
        type: Number,
        default: 0  
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('User', User);
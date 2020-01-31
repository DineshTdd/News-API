const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    name: {
        type: String,
        required: true,
        max: 255,
        min: 1
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        require: true,
        max: 1024,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    img: 
      { data: Buffer, contentType: String }
});

module.exports = mongoose.model('User', userSchema);
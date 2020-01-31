const mongoose = require('mongoose');

const logsSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    userId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    usage: {
        entryTime: Date,
        exitTime: Date,
        activeMinutes: Number   
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Logs', logsSchema);
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

const collectionLogsSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    userId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    articleUrl: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = {
    UserActivityLogs: mongoose.model('Logs', logsSchema),
    CollectionActivityLogs: mongoose.model('CollectionLogs', collectionLogsSchema)
}
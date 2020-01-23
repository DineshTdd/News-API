const {client} = require('../../config/redisconfig');

exports.RedisLogSave = async (message) => {
    await client.LPUSH('logs', message);
};
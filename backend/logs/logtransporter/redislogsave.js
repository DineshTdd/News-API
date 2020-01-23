const {client} = require('../../config/redisconfig');
const msgpack = require("msgpack-lite");
const sizeof = require('object-sizeof');
 

exports.RedisLogSave = async (message) => {

    console.log(sizeof(message))

    // encode from JS Object to MessagePack (Buffer)
    const buffer = msgpack.encode(message);
    //console.log(Buffer.byteLength(buffer));
    console.log(sizeof(buffer));
    

    await client.LPUSH('logs', buffer);
    await client.LRANGE('logs', 0, -1, async (err, reply) => {
        if (err) console.log(err); 
        console.log(reply)
        await reply.forEach(element => {
            console.log(msgpack.decode(msgpack.encode(element)))
        });
    });

};
const {client} = require('../../config/redisconfig');
// const msgpack = require("msgpack-lite");
// const sizeof = require('object-sizeof');
const { performance, PerformanceObserver } = require('perf_hooks');

 

exports.RedisLogSave = async (message) => {
    try{


    // encode from JS Object to MessagePack (Buffer)
    // let buffer = msgpack.encode(JSON.stringify(message));

    // Observes high resolution performance metrics
    const obs = new PerformanceObserver((items) => {
        console.log('It took ' + items.getEntries()[0].duration + ' ms.');
        performance.clearMarks();
      });
    obs.observe({ entryTypes: ['measure'] });


    // performance.mark('A')
    const buffer = Buffer.from(JSON.stringify(message), 'ascii'); 
    // performance.mark('B')
    // performance.measure('A to B', 'A', 'B') // It took 0.174399 ms.
    

    await client.LPUSH('logs', buffer);
    // await client.LRANGE('logs', 0, -1, async (err, reply) => {
        // if (err) console.log(err); 
        //console.log(reply)
        // await reply.forEach(element => {
            // console.log(JSON.parse(element).message)
        // });
    // });
    } catch(err) {
        console.log(err)
    }
};
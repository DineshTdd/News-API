const { UserActivityLogs, CollectionActivityLogs } = require('../models/Logs');
const {client: redisClient} = require('../config/redisconfig');
const mongoose = require('mongoose');

exports.redisCollectionActivitySave = async (res, createdAt, userid, content, articleUrl) => {
    const hsetname = `collectionlog-${userid}-${createdAt}`
    await redisClient.HMSET(hsetname, ["content", content, "savedat", createdAt, "articleurl", articleUrl, "userid", userid], async function(err,response){
        if(err){
            console.log(err);
            return res.status(200).json({success: false});
        }else{
            await redisClient.LPUSH(`collectionlogs-${userid}`, hsetname)
            return res.status(200).json({success: true});
        }
    });
}

exports.redisCollectionActivityToMongo = async (userid) => {
    try {
        await redisClient.LRANGE(`collectionlogs-${userid}`, 0, -1, async (err, reply) => {
        if (err) console.log(err); 
        await reply.forEach(async element => {
           await redisClient.HMGET(element, ["content", "savedat", "articleurl", "userid"], function(err,response){
            if(err){
                console.log(err)
            }else{
                const _id = mongoose.Types.ObjectId();
                const collectionLog = new CollectionActivityLogs({
                    _id: _id,
                    userId: response[3],
                    content: response[0],
                    articleUrl: response[2],
                    date: response[1],
                });
                collectionLog.save().then(createdPost => 
                    createdPost
                );     
            }
            });
            await redisClient.HDEL(element, ["content", "savedat", "articleurl", "userid"], function(err,response){
                if(err){
                    console.log(err)
                }else{
                    console.log(response)
                }
            });
            await redisClient.DEL(`collectionlogs-${userid}`, function(err,response){
                if(err){
                    console.log(err)
                }else{
                    console.log(response)
                }
            });
            return;
        });
    });
    } catch(err) {
        console.log(err);
    }
}

exports.getUserActivityLogs = async (userId, res) => {
    try {
        await UserActivityLogs.find({userId: userId}).then( async result =>{
            if(result.length !== 0) {
               let newresult = await result.map( item => {
                    let entryTime = new Date(new Date(item.usage.entryTime).getTime() - new Date(item.usage.entryTime).getTimezoneOffset()*60*1000);
                    entryTime =  entryTime.toGMTString().slice(0, -4);
                    let exitTime = new Date(new Date(item.usage.exitTime).getTime() - new Date(item.usage.exitTime).getTimezoneOffset()*60*1000);
                    exitTime =  exitTime.toGMTString().slice(0, -4);
                    let activeMinutes;
                    activeMinutes = `${item.usage.activeMinutes} minutes`
                    if (item.usage.activeMinutes > 100 ) {
                        activeMinutes = `${Math.ceil( item.usage.activeMinutes/ 60 )} hours`;
                    }
                    const newItem =  { 
                        usage:
                        { entryTime: entryTime,
                          exitTime: exitTime,
                          activeMinutes: activeMinutes },
                        _id: item._id,
                        userId: item.userId,
                        content: item.content,
                        date: item.date,
                       __v: item.__v 
                    }
                    return newItem
                })
                newresult = newresult.sort((a,b) => new Date(b.usage.exitTime)- new Date(a.usage.exitTime))
                return res.status(200).json({
                    result: newresult
            });
            } else {
                return res.status(200).json({
                    message: 'No logs available!'
                });
            }
        }).catch(err => res.status(500).send(err));
    } catch(err) {
        return res.status(500).send(err);
    }
}
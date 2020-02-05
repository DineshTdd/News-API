const {
    UserActivityLogs,
    CollectionActivityLogs
} = require('../models/Logs');
const {
    client: redisClient
} = require('../config/redisconfig');
const mongoose = require('mongoose');

const hset = (hsetname) => new Promise((resolve, reject) => {
    redisClient.HMGET(hsetname, ["content", "savedat", "articleurl", "userid"], (err, response) => {
        if (err) reject(err)
        resolve(response)
    });
});

const createCollectionLog = (response) => new Promise((resolve, reject) => {
    const _id = mongoose.Types.ObjectId();
    const collectionLog = {
        _id: _id,
        userId: response[3],
        content: response[0],
        articleUrl: response[2],
        date: response[1],
    };
    resolve(collectionLog)
})

exports.redisCollectionActivityFetch = async (res, userid) => {
    try {
        const hlists = new Promise((resolve, reject) => {
            redisClient.LRANGE(`collectionlogs-${userid}`, 0, -1, (err, response) => {
                if (err) reject(err)
                resolve(response)
            });
        });
        

        const formResultArray = (data) => new Promise((resolve, reject) => {
            // const formArray = (data) => {
            //     dataArr.concat(data)
            // }
            // data.forEach(hsetname => {
            // hset(hsetname)
            //     .then(async (response) => {
            //         let collectionLog = await createCollectionLog(response)
            //         dataArr.push(collectionLog);
            //     })
            // .catch(err => res.status(500).json({
            //     message: 'Fetching Redis Data Failed!'
            // }))
            // });
            // for(let i=0; i<data.length; i++) {
            //     hset(data[i])
            //         .then(async (response) => {
            //             let collectionLog = await createCollectionLog(response)
            //             dataArr.push(collectionLog);
            //         }).then((res) => console.log('========>>',res))
            //     .catch(err => res.status(500).json({
            //         message: 'Fetching Redis Data Failed!'
            //     }))
            // }
            require('bluebird').mapSeries(data, async (datum) => {
                const response = await hset(datum);
                let collectionLog = await createCollectionLog(response);
                // dataArr.push(collectionLog);
                return collectionLog;
            }).then((result) => {
                return resolve(result);
            }, err => {
                console.log(err.message);
                return reject(err)
            })
        });

        const result = new Promise((resolve, reject) => {
                hlists.then(data => formResultArray(data))
                    .then(result => resolve(result))
                    .catch(err => {
                        reject(err);
                        res.status(500).json({
                            message: 'Redis Client Failed!'
                        })
                    })
            })
            .catch(err => res.status(500).json({
                message: 'Redis Client Failed!'
            }));
        result.then(result => {
            if(result.length > 0) {
                return res.status(200).json({
                    result
                });
            }
            else {
                return res.status(200).json({
                    result: []
                });
            }
        }).catch(err => res.status(500).json({
            message: 'Fetching Redis Data Failed!'
        }))

    } catch (err) {
        console.log(err)
    }
}

exports.redisCollectionActivitySave = async (res, createdAt, userid, content, articleUrl) => {
    const hsetname = `collectionlog-${userid}-${createdAt}`
    await redisClient.HMSET(hsetname, ["content", content, "savedat", createdAt, "articleurl", articleUrl, "userid", userid], async function (err, response) {
        if (err) {
            console.log(err);
            return res.status(200).json({
                success: false
            });
        } else {
            await redisClient.LPUSH(`collectionlogs-${userid}`, hsetname)
            return res.status(200).json({
                success: true
            });
        }
    });
}

exports.redisCollectionActivityToMongo = async (userid) => {
    try {
        await redisClient.LRANGE(`collectionlogs-${userid}`, 0, -1, async (err, reply) => {
            if (err) {
                console.log(err);
                return;
            }
            const document = await CollectionActivityLogs.findOne({
                userId: userid
            }).sort('-docId').exec();
            let docId;
            if (document) {
                docId = document.docId;
            } else {
                docId = 0;
            }
            const delHset = (hsetname) => new Promise((resolve, reject) => {
                redisClient.HDEL(hsetname, ["content", "savedat", "articleurl", "userid"], function (err, response) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(response)
                    }
                });
            })

            const delList = (listname) => new Promise((resolve, reject) => {
                redisClient.DEL(`collectionlogs-${userid}`, function (err, response) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(response)
                    }
                });
            })
            const getCollectionLogs = (reply) => new Promise((resolve, reject) => {
                require('bluebird').mapSeries(reply, async (datum) => {
                    const response = await hset(datum);
                    let collectionLog = await createCollectionLog(response);
                    await delHset(datum);
                    // dataArr.push(collectionLog);
                    return collectionLog;
                }).then((result) => {
                    return resolve(result);
                }, err => {
                    console.log(err.message);
                    return reject(err)
                })
            })
            
            getCollectionLogs(reply).then(async result => {                
                const newresult = result.sort((a, b) => new Date(a.date) - new Date(b.date))
                console.log(newresult)
                await newresult.forEach(element =>{
                    const _id = mongoose.Types.ObjectId();
                    const collectionLog = new CollectionActivityLogs({
                        ...element,
                        _id: _id,
                        docId: ++docId
                    });
                    collectionLog.save().then(createdPost =>
                        createdPost
                    );
                })
            }).then(delList(`collectionlogs-${userid}`));

            // await reply.forEach(async element => {
            //     await redisClient.HMGET(element, ["content", "savedat", "articleurl", "userid"], async function (err, response) {
            //         if (err) {
            //             console.log(err)
            //         } else {
            //             const _id = mongoose.Types.ObjectId();
            //             const collectionLog = new CollectionActivityLogs({
            //                 _id: _id,
            //                 docId: ++docId,
            //                 userId: response[3],
            //                 content: response[0],
            //                 articleUrl: response[2],
            //                 date: response[1],
            //             });
            //             collectionLog.save().then(createdPost =>
            //                 createdPost
            //             );
            //         }
            //     });
            //     await redisClient.HDEL(element, ["content", "savedat", "articleurl", "userid"], function (err, response) {
            //         if (err) {
            //             console.log(err)
            //         } else {
            //             console.log(response)
            //         }
            //     });
            // });
            // return;
        });
        // await redisClient.DEL(`collectionlogs-${userid}`, function (err, response) {
        //     if (err) {
        //         console.log(err)
        //     } else {
        //         console.log(response)
        //     }
        // });
    } catch (err) {
        console.log(err);
    }
}

exports.getUserActivityLogs = async (userId, res) => {
    try {
        await UserActivityLogs.find({
            userId: userId
        }).then(async result => {
            if (result.length !== 0) {
                let newresult = await result.map(item => {
                    let entryTime = new Date(new Date(item.usage.entryTime).getTime() - new Date(item.usage.entryTime).getTimezoneOffset() * 60 * 1000);
                    entryTime = entryTime.toGMTString().slice(0, -4);
                    let exitTime = new Date(new Date(item.usage.exitTime).getTime() - new Date(item.usage.exitTime).getTimezoneOffset() * 60 * 1000);
                    exitTime = exitTime.toGMTString().slice(0, -4);
                    let activeMinutes;
                    activeMinutes = `${item.usage.activeMinutes} minutes`
                    if (item.usage.activeMinutes > 100) {
                        activeMinutes = `${Math.ceil( item.usage.activeMinutes/ 60 )} hours`;
                    }
                    const newItem = {
                        usage: {
                            entryTime: entryTime,
                            exitTime: exitTime,
                            activeMinutes: activeMinutes
                        },
                        _id: item._id,
                        userId: item.userId,
                        content: item.content,
                        date: item.date,
                        __v: item.__v
                    }
                    return newItem
                })
                newresult = newresult.sort((a, b) => new Date(b.usage.exitTime) - new Date(a.usage.exitTime))
                return res.status(200).json({
                    result: newresult
                });
            } else {
                return res.status(200).json({
                    message: 'No logs available!'
                });
            }
        }).catch(err => res.status(500).send(err));
    } catch (err) {
        return res.status(500).send(err);
    }
}

exports.getCollectionActivityLogs = async (userId, total, start, end, res) => {
    try {
        total = parseInt(total);
        start = parseInt(start);
        end = parseInt(end);
        if (start === 0 && end === 0 && total === 0) {
            const document = await CollectionActivityLogs.findOne({
                userId: userId
            }).sort('-docId').exec();
            let docId;
            if (document) {
                docId = document.docId;
            } else {
                docId = 0;
                return res.status(200).json({
                    totalCollectionLogs: docId
                })
            }
            const diff = docId - 5;
            const documents = await CollectionActivityLogs.find({
                userId: userId,
                docId: {
                    $gte: (diff > 0) ? diff + 1 : 1,
                    $lt: docId + 1
                }
            }).sort('-docId').exec();
            return res.status(200).json({
                documents: documents,
                totalCollectionLogs: docId,
                remainingCollectionLogs: (diff > 0) ? diff : 0,
                fetchedCollectionLogs: (diff > 0) ? 5 : docId + diff,
                nextStartRange: (diff > 0) ? diff : 0,
                nextEndRange: (diff > 0) ? ((diff - 5 > 0) ? diff - 5 : 1) : 0
            })
        } else {
            const documents = await CollectionActivityLogs.find({
                userId: userId,
                docId: (start === end) ? start : {
                    $gt: end,
                    $lte: start
                }
            }).sort('-docId').exec();
            const diff = end - 5;
            return res.status(200).json({
                documents: documents,
                totalCollectionLogs: total,
                remainingCollectionLogs: (diff > 0) ? end : 0,
                fetchedCollectionLogs: (diff > 0) ? 5 : start - end,
                nextStartRange: (diff > 0) ? end : 0,
                nextEndRange: (diff > 0) ? diff : 1
            })
        }
    } catch (err) {
        return res.status(500).send(err);
    }
}
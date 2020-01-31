const Logs = require('../models/Logs');

exports.getUserActivityLogs = async (userId, res) => {
    try {
        await Logs.find({userId: userId}).then( async result =>{
            if(result.length !== 0) {
               let newresult = await result.map( item => {
                    let entryTime = new Date(new Date(item.usage.entryTime).getTime() - new Date(item.usage.entryTime).getTimezoneOffset()*60*1000);
                    entryTime =  entryTime.toGMTString().slice(0, -4);
                    let exitTime = new Date(new Date(item.usage.exitTime).getTime() - new Date(item.usage.exitTime).getTimezoneOffset()*60*1000);
                    exitTime =  exitTime.toGMTString().slice(0, -4);
                    const newItem =  { 
                        usage:
                        { entryTime: entryTime,
                          exitTime: exitTime,
                          activeMinutes: item.usage.activeMinutes },
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
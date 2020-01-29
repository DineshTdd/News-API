// const mongoose = require('mongoose');
const User = require('../models/User');

//new mongoose.Types.ObjectId(`${userId}`)
exports.fetchUserDetails = async (userId, res) => {
    try {
        await User.findById(userId).then(result => {
            return res.status(200).json({
                result: result
            })
        })
    } catch(err) {
        return res.send(500).json({
            message: 'fetching user failed!'
        })
    }
}

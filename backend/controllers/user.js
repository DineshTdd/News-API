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

exports.setUserProfilePicture = async (imgBufferData, contentType, userId ,res) => {
    try {
        const filter = {
            _id: userId
        };
        const update = {
            img: {
                data: imgBufferData,
                contentType: contentType
            }
        }
        const docResponse = await User.findOneAndUpdate(filter, update, {
            new: true // document returned after update
        });
        return res.status(200).json({
            file: docResponse.img.data.toString('base64'),
            contentType: docResponse.img.contentType
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Updating profile picture failed!'
        })
    }
}

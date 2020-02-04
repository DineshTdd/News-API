const User = require('../models/User');
const { UserActivityLogs } = require('../models/Logs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { redisCollectionActivityToMongo } = require('./logs');


exports.registerNewUser = async ( user, res ) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        const _id = mongoose.Types.ObjectId();

        const newUser = new User({
            _id: _id,
            ...user,
            password: hashedPassword
        });

        await User.findOne({email: user.email}).then(result => {
            if(result) {
                return res.status(400).json({
                    message: 'Email already exists!'
                });
            } else {
                return newUser.save().then(createdPost => 
                    res.status(201).json({
                        message: `User ${createdPost.name} added successfully`,
                    })
                )
                .catch( error => 
                    res.status(500).json({
                        message: 'Creating a user failed!'
                        })
                );
            }
          })
          .catch(err => res.status(400).send(err));

    } catch (err) {
        return res.status(400).send(err);
    }
};

exports.loginUser = async ( user, res ) => {
    const date = new Date();
    // let newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
    // newDate = newDate.toGMTString();
    const { email, password } = user;
    await User.findOne({email: email}).then(async user => {
        if(user) {
            const isValid = await bcrypt.compare(password, user.password);
            if(!isValid) {
                return res.status(400).json({
                    message: 'Incorrect password!'
                });
            }
            const token = jwt.sign({email: user.email, _id: user._id}, 
                process.env.JWT_KEY, {
                expiresIn: '24h'
            });
           await User.findOneAndUpdate({email: email}, {lastLogin: date}, {
                new: true // document returned after update
            })
            res.header('auth-token', token).json({
                _id: user._id,
                token: token,
                expiresIn: '24h',
                message: 'Login Successful!'
            });
            

        } else {
            return res.status(400).json({
                message: 'Email does not exist!'
            });
        }
      })
      .catch(err => res.status(400).send(err));
};

exports.logoutUser = async (logoutTime, userId, res) => {
    try {
        const _id = mongoose.Types.ObjectId();
        const date = new Date(logoutTime)
        let lastLogin;
        await User.findById(userId).then(async user => {
            if(user) {
                lastLogin = await new Date(user.lastLogin);
            }
        }).catch(err => res.status(400).send(err))
        const activeMinutes = Math.ceil(Math.abs(date - lastLogin) / (1000 * 60 )); // for days 1000 * 60 * 60 * 24
        const newLog = new UserActivityLogs({
            _id: _id,
            userId: userId,
            content: `You were active on `,
            usage: {
                entryTime: lastLogin,
                exitTime: date,
                activeMinutes: activeMinutes
            }
        });
        await redisCollectionActivityToMongo(userId);
        return newLog.save().then(createdPost => 
            res.status(201).json({
                message: `Log ${createdPost} added successfully`,
        }));
    } catch(err) {
        return res.status(500).send(err);
    }
};
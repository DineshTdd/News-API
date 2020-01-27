const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerNewUser = async ( user, res ) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        const newUser = new User({
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
                expiresIn: '1h'
            });

            res.header('auth-token', token).json({
                _id: user._id,
                token: token,
                expiresIn: 3600,
                message: 'Login Successful!'
            });

            // return res.status(200).json({
            //     _id: user._id,
            //     token: token,
            //     expiresIn: 3600,
            //     message: 'Login Successful!'
            // });

        } else {
            return res.status(400).json({
                message: 'Email does not exist!'
            });
        }
      })
      .catch(err => res.status(400).send(err));
};
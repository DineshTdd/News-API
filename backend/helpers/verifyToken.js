const jwt = require('jsonwebtoken');
const { client: redisClient } = require('../config/redisconfig');
const { logoutUser } = require('../controllers/auth')



module.exports = function( req, res, next ) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied!');

    try {
        const verified = jwt.verify(token, process.env.JWT_KEY );
        req.user = verified;
        const userid = req.header('userid')
        redisClient.EXISTS(`${userid}`, (err, reply) => {
            if(reply === 1) {
                next();
            } else {
                logoutUser(Date.now(),userid, res)
            }
            if (err) console.log(err)
        })
    } catch(err) {
        res.status(400).send('Invalid Token');
    }
}
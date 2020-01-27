const router = require('express').Router();
const { registerNewUser, loginUser } = require('../controllers/auth');
const { registerValidation, loginValidation } = require('../helpers/validation');


router.post('/register', async (req, res) => {
    
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    const { error } = registerValidation(user);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    await registerNewUser(user, res);
});

router.post('/login', async (req,res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const { error } = loginValidation(user);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    await loginUser(user, res);
});

module.exports = router;
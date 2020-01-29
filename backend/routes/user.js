const router = require('express').Router();
const { fetchUserDetails } = require('../controllers/user');

router.get('/fetch', async(req, res) => {
    try {
    const userId  = req.header('userid');
    await fetchUserDetails(userId, res);
    } catch(err) {
        console.error(err);
    }
});

module.exports = router;
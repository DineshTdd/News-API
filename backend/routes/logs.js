const router = require('express').Router();
const { getUserActivityLogs } = require('../controllers/logs');

router.get('/getUserActivity', async (req,res) => {

    try {
        const userId  = await req.header('userid');
        await getUserActivityLogs(userId, res);
    } catch(err) {
        console.error(err)
    }
});

module.exports = router;
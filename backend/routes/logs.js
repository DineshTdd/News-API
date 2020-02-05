const router = require('express').Router();
const { getUserActivityLogs , getCollectionActivityLogs, redisCollectionActivityFetch } = require('../controllers/logs');

router.get('/getUserActivity', async (req,res) => {

    try {
        const userId  = await req.header('userid');
        await getUserActivityLogs(userId, res);
    } catch(err) {
        console.error(err)
    }
});


router.get('/getCollectionActivity/start/:start/end/:end/total/:total', async (req,res) => {

    try {
        const start = req.params.start;
        const end = req.params.end;
        const total = req.params.total;
        const userId  = await req.header('userid');
        await getCollectionActivityLogs(userId,total,start, end, res);
    } catch(err) {
        console.error(err)
    }
});

router.get('/getCurrentCollectionActivityLogs', async (req, res) => {
    try {
        const userid  = await req.header('userid');
        await redisCollectionActivityFetch(res, userid);
    } catch(err) {
        console.log(err)
    }
})

module.exports = router;
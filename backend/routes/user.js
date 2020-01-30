const router = require('express').Router();
const { fetchUserDetails, setUserProfilePicture } = require('../controllers/user');
const fs = require('fs');
const formidable = require('formidable');

router.get('/fetch', async(req, res) => {
    try {
    const userId  = req.header('userid');
    await fetchUserDetails(userId, res);
    } catch(err) {
        console.error(err);
    }
});

router.post('/setProfilePicture', async(req, res) => {
    try {
        const userId  = req.header('userid');
        let getFormData = (req) => {
            return new Promise((resolve, reject) => {
                new formidable.IncomingForm().parse(req, (err, fields, files) => {
                    if (err) {
                      console.error('Error', err)
                      reject(err)
                    }
                    const file = files.file;
                    resolve(file);
                });
            })
        };
        getFormData(req).then(
            file => setUserProfilePicture(fs.readFileSync(file.path), file.type, userId, res)
        ).catch(err => console.error(err));
    } catch(err) {
        console.error(err)
    }
});

module.exports = router;
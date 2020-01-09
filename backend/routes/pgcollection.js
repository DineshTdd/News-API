const express = require('express');
const router = express.Router();

const { getNews, postNews, deleteNews, updateNews } = require('../controllers/pgcollection');

router
    .route('/fetchNews')
    .get(getNews);

router
    .route('/postNews')
    .post(postNews);
router
    .route('/deleteNews')
    .delete(deleteNews);
router
    .route('/updateNews')
    .patch(updateNews);

module.exports = router;
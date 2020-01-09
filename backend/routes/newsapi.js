const express = require('express');
const router = express.Router();

const { getNews } = require('../controllers/newsapi');

router
    .route('/country/:countryId/category/:categoryId/page/:pageno')
    .get(getNews);

module.exports = router;
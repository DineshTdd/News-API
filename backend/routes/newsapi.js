const express = require('express');
const router = express.Router();

const { getNews } = require('../controllers/newsapi');
<<<<<<< HEAD
/**
 * @api {get} /country/:countryId/category/:categoryId/page/:pageno Request News Information from NewsApi
 * @apiName getNews
 * @apiGroup NewsApi
 *
 * @apiParam {String} CountryId Country unique ID.
 * @apiParam {String} CategoryId Category unique ID.
 * @apiParam {Number} PageNo For Pagination Purpose
 * @apiSuccess {Array} news Array of objects of news article
 */
=======

>>>>>>> 5cf1018274f328947e1106f5c258345455262689
router
    .route('/country/:countryId/category/:categoryId/page/:pageno')
    .get(getNews);

module.exports = router;
const express = require('express');
const router = express.Router();

const { getNews, postNews, deleteNews, updateNews } = require('../controllers/pgcollection');
/**
 * @api {get} /pgcollection/v1/news/fetchNews Request News Information from Postgresql
 * @apiName getNews
 * @apiGroup PgCollection
 *
 * @apiSuccess {Array} news Array of objects of news article from PG
 */
router
    .route('/fetchNews')
    .get(getNews);
/**
 * @api {post} /pgcollection/v1/news/postNews Post News Information to Postgresql
 * @apiName postNews
 * @apiGroup PgCollection
 *
 * @apiSuccess {Array} news Array of objects of news article from PG
 * @apiParamExample {Object} Request-Example:
 * formValues: {
 *       author: '',
 *       title: '',
 *       imageUrl: '',
 *       description: '',
 *       articleUrl: '',
 *       sourceName: ''
 *  }
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "true"
 *     }
 */
router
    .route('/postNews')
    .post(postNews);
/**
 * @api {delete} /pgcollection/v1/news/deleteNews Delete News Information from Postgresql
 * @apiName deleteNews
 * @apiGroup PgCollection
 *
 * @apiSuccess {Array} news Array of objects of news article from PG
 * @apiParamExample {Object} Request-Example:
 * {
 *  data: 
 *      { 
 *          id: articleurl URL of article to be deleted 
 *      }
 *  }
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "true"
 *     }
 */
router
    .route('/deleteNews')
    .delete(deleteNews);
/**
 * @api {patch} /pgcollection/v1/news/updateNews Update News Information to Postgresql
 * @apiName updateNews
 * @apiGroup PgCollection
 *
 * @apiSuccess {Array} news Array of objects of news article from PG
 * @apiParamExample {Object} Request-Example:
 * { 
 *      data: { 
 *              formValues: getState().collections.formValues FormValues from State of Collections
 *             } 
 *  }
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "true"
 *     }
 */
router
    .route('/updateNews')
    .patch(updateNews);

module.exports = router;
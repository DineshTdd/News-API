const {client: pgClient} = require('../config/pgdbconfig');
const { redisCollectionActivitySave } = require('./logs');

// @desc Get all news from collection in postgres
// @route GET /pgcollection/v1/news/fetchNews
// @access Public
exports.getNews = async (req, res, next) => { 
    try {
        const response = (result) => {
            return res.status(200).json({
                success: true,
                data: result
            });
        };
        await pgClient.query('SELECT * FROM public.collection where userid=$1',[req.header('userid')],async function (err, result) {
            if (err) {
                throw new Error(err);
            }
            await response(result.rows);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error'});
    }
};

// @desc Post news to collection in postgres
// @route POST /pgcollection/v1/news/postNews
// @access Public
exports.postNews = async (req, res, next) => { 
    try {
        const formValues = req.body;
        const userid= req.header('userid');
        const queryString = 'INSERT INTO public.collection(title, source, imageurl, description, author, articleurl, userid) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (articleurl) DO NOTHING';
        await pgClient.query( queryString ,
             [formValues.title, formValues.sourceName, formValues.imageUrl, formValues.description, formValues.author, formValues.articleUrl, userid] 
             , async function (err, result) {
            if (err) {
                console.log(err);
                return res.status(200).json({success: false});
            }
            if (result.rowCount === 1) {
                let date = new Date();
                date = date.toISOString()
                redisCollectionActivitySave(res, date, userid, 'You saved an article', formValues.articleUrl)
            } else if(result.rowCount === 0) {
                return res.status(200).json({success: false});
            }
        });
        
        //5e34005592437e4c5cc8e255
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error'});
    }
};

// @desc Delete news from collection in postgres
// @route DELETE /pgcollection/v1/news/deleteNews
// @access Public
exports.deleteNews = async (req, res, next) => { 
    try {
        const {id} = req.body;
        const queryString = 'DELETE FROM public.collection where articleurl=$1';
        await pgClient.query( queryString, [id],function (err, result) {
            if (err) {
                throw new Error(err);
            }
            console.log(result)
            if(result.rowCount === 0) {
                return res.status(404).json({success: false})
            }
            let date = new Date()
            date = date.toISOString()
            redisCollectionActivitySave(res, date, req.header('userid'), 'You have deleted an article!', id)
            return res.status(200).json({success: true});
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error'});
    }
};

// @desc Update news to collection in postgres
// @route PATCH /pgcollection/v1/news/postNews
// @access Public
exports.updateNews = async (req, res, next) => { 
    try {
        const {formValues} = req.body.data;
        const queryString = 'UPDATE public.collection SET title=$1, source=$2, imageurl=$3, description=$4, author=$5, articleurl=$6 WHERE articleurl=$7;';
        await pgClient.query( queryString ,
             [formValues.title, formValues.sourceName, formValues.imageUrl, formValues.description, formValues.author, formValues.articleUrl, formValues.articleUrl] 
             ,function (err, result) {
            if (err) {
                throw new Error(err);
            }
            let date = new Date();
            date = date.toISOString()
            redisCollectionActivitySave(res, date, req.header('userid'), 'You edited an article', formValues.articleUrl)
            return res.status(200).json({success: true});
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error'});
    }
};

exports.updateArticleRating = async (req, res, next) => {
    try {
        const {rating, articleUrl} = req.body.data;
        const queryString = 'UPDATE public.collection SET articlerating=$1 WHERE articleurl=$2;';
        await pgClient.query( queryString ,
             [rating, articleUrl] 
             ,function (err, result) {
            if (err) {
                throw new Error(err);
            }
            return res.status(200).json({success: true});
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Server error'});
    }
}
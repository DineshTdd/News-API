const axios = require('axios')

// @desc Get all news
// @route GET /api/v1/news
// @access Public
exports.getNews = async (req, res, next) => {
    try {
        var countryId = (req.params.countryId) ? req.params.countryId : 'in';
        // ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie 
        //il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se 
        //sg si sk th tr tw ua us ve za
        var categoryId = (req.params.categoryId) ? req.params.categoryId :'business';
        // business entertainment general health science sports technology
        var pageNo = (req.params.pageno) ? req.params.pageno : '1';
        var news = await axios.get(`https://newsapi.org/v2/top-headlines?country=${countryId}&category=${categoryId}&pageSize=10&page=${pageNo}&apiKey=${process.env.NEWSAPI_APIKEY}`)
        const totalResults = news.data.totalResults;
        var keyId = 0;
        news = news.data.articles.map( item => {
            return {
                key: ++keyId,
                sourceName: item.source.name,
                author: item.author,
                title: item.title,
                description: item.description,
                url: item.url,
                urlToImage: item.urlToImage,
                publishedAt: item.publishedAt
            };
        });
        return res.status(200).json({
            success: true,
            count: totalResults,
            data: news
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error'});
    }
};

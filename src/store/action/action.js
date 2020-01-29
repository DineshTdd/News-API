const axios = require('axios')

export const CHANGE_COUNTRY = 'CHANGE_COUNTRY';
export const CHANGE_CATEGORY = 'CHANGE_CATEGORY';
export const CHANGE_TOTAL_PAGE = 'CHANGE_TOTAL_PAGE';
export const CHANGE_ACTIVE_PAGE = 'CHANGE_ACTIVE_PAGE';
export const CHANGE_DATA = 'CHANGE_DATA';
export const CHANGE_ISNEWSFETCHING = 'CHANGE_ISNEWSFETCHING';

// fetching news from NEWSAPI
export const fetchNews = () => {
    return async (dispatch, getState) =>  {
        const activePage = getState().news.activePage.toString();
        const country = getState().news.country;
        const category = getState().news.category;
        const { token } = getState().auth.userData;
        try {
            await dispatch({
                type: CHANGE_ISNEWSFETCHING,
                payload: {value: true}
            })
            const response = await axios.get(`http://localhost:5000/api/v1/news/country/${country}/category/${category}/page/${activePage}`,
            {
                headers: {
                  'auth-token': token
                }
            });
            await dispatch({
                type: CHANGE_DATA,
                payload: {value: response}
            });
            await dispatch({
                type: CHANGE_ISNEWSFETCHING,
                payload: {value: false}
            })
        }
        catch (err) {
            console.error(err);
        }
        };
};
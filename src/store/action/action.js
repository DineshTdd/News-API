import { push } from 'connected-react-router';
import { REMOVE_USER_SESSION } from './authAction'
const axios = require('axios')
const {fetchUserDetails} = require('./userAction');

export const CHANGE_COUNTRY = 'CHANGE_COUNTRY';
export const CHANGE_CATEGORY = 'CHANGE_CATEGORY';
export const CHANGE_TOTAL_PAGE = 'CHANGE_TOTAL_PAGE';
export const CHANGE_ACTIVE_PAGE = 'CHANGE_ACTIVE_PAGE';
export const CHANGE_DATA = 'CHANGE_DATA';
export const CHANGE_ISNEWSFETCHING = 'CHANGE_ISNEWSFETCHING';
export const TOGGLE_ISFIRSTVISIT = 'TOGGLE_ISFIRSTVISIT';

export const redirect = () => {
    return async (dispatch, getState) => {
        dispatch(push('/'))
    }
}

// fetching news from NEWSAPI
export const fetchNews = () => {
    return async (dispatch, getState) =>  {
        const activePage = getState().news.activePage.toString();
        const country = getState().news.country || 'in';
        const category = getState().news.category || 'Business';
        const { token, _id } = getState().auth.userData;
        try {
            await dispatch({
                type: CHANGE_ISNEWSFETCHING,
                payload: {value: true}
            })
            const response = await axios.get(`http://localhost:5000/api/v1/news/country/${country}/category/${category}/page/${activePage}`,
            {
                headers: {
                  'auth-token': token,
                  'userid': _id
                }
            });

            if(response.data.logout) {
                await dispatch({
                    type: CHANGE_ISNEWSFETCHING,
                    payload: {value: false}
                })
               await dispatch({type: REMOVE_USER_SESSION})
                await dispatch(push('/'))
            } else {
                await dispatch({
                    type: CHANGE_DATA,
                    payload: {value: response}
                });
                await dispatch({
                    type: CHANGE_ISNEWSFETCHING,
                    payload: {value: false}
                })
                await dispatch(fetchUserDetails());
            }
        }
        catch (err) {
            console.log(err)
        }
        };
};
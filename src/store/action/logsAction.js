import { push } from 'connected-react-router';
import { REMOVE_USER_SESSION } from './authAction'
const axios = require('axios');
export const SET_USER_ACTIVITY_LOGS = 'SET_USER_ACTIVITY_LOGS';
export const SET_COLLECTION_ACTIVITY_LOGS= 'SET_COLLECTION_ACTIVITY_LOGS';
export const SET_CURRENT_COLLECTION_ACTIVITY_LOGS = 'SET_CURRENT_COLLECTION_ACTIVITY_LOGS';
export const RESET_LOGS_STATE = 'RESET_LOGS_STATE';
export const SET_BAR_VALUE = 'SET_BAR_VALUE';

const checkIsLogout = (response) => {
    return async (dispatch, getState) => {
        if(response.data.logout) {
            dispatch({type: REMOVE_USER_SESSION})
            dispatch(push('/'))
        } else {
            return;
        }
    }
}

export const fetchCollectionActivityLogs = () => {
    return async (dispatch, getState) => {
        try {
            const { _id, token } = getState().auth.userData;
            const { nextStartRange, nextEndRange, totalCollectionLogs } = getState().logs;
            const response = await axios.get(`http://localhost:5000/logs/getCollectionActivity/start/${nextStartRange}/end/${nextEndRange}/total/${totalCollectionLogs}`,
            {
                headers: {
                  'auth-token': token,
                  'userid': _id.toString()
                }
            });
            checkIsLogout(response)
            if (response.data) {
                await dispatch({
                    type: SET_COLLECTION_ACTIVITY_LOGS,
                    payload: response.data
                });
            }
        } catch(err) {
            console.log(err)
        }
    }
}

export const fetchUserActivityLogs = () => {
    return async (dispatch, getState) => {
        try {
            const { _id, token } = getState().auth.userData;
            const response = await axios.get(`http://localhost:5000/logs/getUserActivity`,
            {
                headers: {
                  'auth-token': token,
                  'userid': _id.toString()
                }
            })
            checkIsLogout(response)
            if (response.data.message) {
                await dispatch({
                    type: SET_USER_ACTIVITY_LOGS,
                    payload: {value: []}
                });  
            } else{
                await dispatch({
                    type: SET_USER_ACTIVITY_LOGS,
                    payload: {value: response.data.result, graph: response.data.values}
                });
            }
        } catch (err) {
            console.log(err)
        }
    }
}

export const fetchCurrentCollectionLogs = () => {
    return async (dispatch, getState) => {
        try {
            const { _id, token } = getState().auth.userData;
            const response = await axios.get(`http://localhost:5000/logs/getCurrentCollectionActivityLogs`,
            {
                headers: {
                  'auth-token': token,
                  'userid': _id.toString()
                }
            })
            checkIsLogout(response)
            if (response.data.message) {
                await dispatch({
                    type: SET_CURRENT_COLLECTION_ACTIVITY_LOGS,
                    payload: {value: []}
                });  
            } else{
                await dispatch({
                    type: SET_CURRENT_COLLECTION_ACTIVITY_LOGS,
                    payload: {value: response.data.result}
                });
            }
        } catch(err) {
            console.log(err)
        }
    }
}
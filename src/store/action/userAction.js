import { push } from 'connected-react-router';
import { REMOVE_USER_SESSION } from './authAction'
const axios = require('axios')
export const SET_USER_DATA = 'SET_USER_DATA';

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

export const fetchUserDetails = () => {
    return async(dispatch, getState) => {
        try {
            const { _id, token } = getState().auth.userData;
            const response = await axios.get(`http://localhost:5000/api/userdetails/fetch`,
            {
                headers: {
                  'auth-token': token,
                  'userid': _id.toString()
                }
            })
            checkIsLogout(response)
            await dispatch({
                type: SET_USER_DATA,
                payload: {value: response}
            });
        } catch(err) {
            console.log(err)
        }
    };
};

export const setProfilePicture = (file) => {
    return async(dispatch, getState) => {
        try {
            const { _id, token } = getState().auth.userData;
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('http://localhost:5000/api/userdetails/setProfilePicture', formData ,{
            headers: {
                'Content-Type': 'multipart/form-data',
                'auth-token': token,
                'userid': _id.toString()
            }
            });
            checkIsLogout(response)
            
            await dispatch(fetchUserDetails())
        } catch(err) {
            console.error({
                err:err,
                msg:'Something wrong with the server!'
            });
        }
    }
}

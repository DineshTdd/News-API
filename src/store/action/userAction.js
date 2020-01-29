const axios = require('axios')
export const SET_USER_DATA = 'SET_USER_DATA';

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
            await dispatch({
                type: SET_USER_DATA,
                payload: {value: response}
            });
        } catch(err) {
            console.log(err)
        }
    };
};
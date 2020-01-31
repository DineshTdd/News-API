const axios = require('axios');
export const SET_USER_ACTIVITY_LOGS = 'SET_USER_ACTIVITY_LOGS';

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
            if (response.data.message) {
                await dispatch({
                    type: SET_USER_ACTIVITY_LOGS,
                    payload: {value: []}
                });  
            } else{
                await dispatch({
                    type: SET_USER_ACTIVITY_LOGS,
                    payload: {value: response.data.result}
                });
            }
        } catch (err) {
            console.log(err)
        }
    }
}
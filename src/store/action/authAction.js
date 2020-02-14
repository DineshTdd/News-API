import { push } from 'connected-react-router';
import * as logsAction from './logsAction';
const axios = require('axios');
// import {createBrowserHistory} from 'history';
export const SET_USER_SESSION = 'SET_USER_SESSION';
export const REMOVE_USER_SESSION = 'REMOVE_USER_SESSION';

// const browserHistory = createBrowserHistory();

export const userSignup = (userDetails) => {
    return async (dispatch, getState) => {
        try {
            await axios.post('http://localhost:5000/api/user/register', userDetails)
                  .then(function (response) {
                    alert('Sign up successful!')
                    dispatch(push('/'))
                  })
                  .catch(function (error) {
                    alert(`${error.response.data.message} try again`);
                    // browserHistory.push('/Signup')
                    dispatch(push('/Signup'))
                  });
        } catch(err) {
            console.error(err);
            alert('Something went wrong please try again');
        }

    }  
}

export const userLogin = (userDetails) => {
    return async (dispatch) => {
        try {
            await axios.post('http://localhost:5000/api/user/login', userDetails)
                  .then(async function (response) {
                    const { _id, token } = response.data;
                    dispatch(setUser(_id, token));
                  })
                  .catch( function (error) {
                    console.log(error);
                    alert(`${error.response.data.message} try again`);
                    // browserHistory.push('/Signup')
                    dispatch(push('/'))
                  });
        } catch(err) {
            console.error(err);
            alert('Something went wrong please try again');
        }

    }  
}

export const setUser = (_id, token) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_USER_SESSION,
        payload: {value: _id, token}
      });
      dispatch(push('/Home'))
    } catch(err) {
      alert('Please try login again!')
    }
  }
}

export const removeUserSession = () => {
  return async (dispatch, getState) => {
    try {
      const { token } = getState().auth.userData;
      await axios.post('http://localhost:5000/api/user/logout', {logoutTime: Date.now()}, {
        headers: {
          'auth-token': token,
          'userid': localStorage.getItem('_id').toString()
        }
    })
      .then(async function (response) {
        console.log(response)
      })
      .catch( function (error) {
        console.log(error);
      });
      dispatch({
        type: REMOVE_USER_SESSION
      });
      dispatch({
        type: logsAction.RESET_LOGS_STATE
      })
      dispatch(push('/'))
    } catch(err) {
      console.error(err);
    }
  }
}
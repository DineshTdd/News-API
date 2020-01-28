import { push } from 'connected-react-router';
// import {createBrowserHistory} from 'history';
const axios = require('axios');
export const SET_USER_SESSION = 'SET_USER_SESSION';
export const REMOVE_USER_SESSION = 'REMOVE_USER_SESSION';

// const browserHistory = createBrowserHistory();

export const userSignup = (userDetails) => {
    return async (dispatch, getState) => {
        try {
            await axios.post('http://localhost:5000/api/user/register', userDetails)
                  .then(async function (response) {
                    await alert('Sign up successful!')
                    dispatch(push('/'))
                  })
                  .catch(async function (error) {
                    console.log();
                    await alert(`${error.response.data.message} try again`);
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
                    await alert('Login successful!')
                    const { _id, token } = response.data;
                    await dispatch(setUser(_id, token));
                  })
                  .catch( function (error) {
                    alert(`${error.response.data.message} try again`);
                    // browserHistory.push('/Signup')
                    dispatch(push('/Login'))
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
      await dispatch({
        type: SET_USER_SESSION,
        payload: {value: _id, token}
      });
      await dispatch(push('/Home'))
    } catch(err) {
      alert('Please try login again!')
    }
  }
}

export const removeUserSession = () => {
  return async (dispatch, getState) => {
    try {
      await dispatch({
        type: REMOVE_USER_SESSION
      });
      await dispatch(push('/'))
    } catch(err) {
      console.error(err);
    }
  }
}
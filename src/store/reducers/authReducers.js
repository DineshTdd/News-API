import * as authAction from '../action/authAction';

if (localStorage.getItem('Authorization') === null || localStorage.getItem('_id') === null) {
    localStorage.setItem('Authorization', undefined);
    localStorage.setItem('_id', undefined);
    localStorage.setItem('createdAt', undefined);
}

let _id = localStorage.getItem('_id');
let token = localStorage.getItem('Authorization');
const createdAt = localStorage.getItem('createdAt');
const now = new Date().getTime();
let decider = false;

if ( createdAt !== undefined && (now - createdAt > 24*60*60*1000)) {
    decider = true;
    _id = undefined;
    token = undefined;
}

const initialState = {
    isUserLoggedIn: ( token !== 'undefined') ? true : false ,
    userData: {
        _id: (_id !== null || _id !== undefined) ? _id : undefined,
        token: (token !== null || token !== undefined) ? token : undefined,
        createdAt: (createdAt === null || createdAt === undefined || decider) ? undefined :createdAt
    }
}

export default(state = initialState, action) => {
    switch(action.type) {
        case authAction.SET_USER_SESSION:
            const { value: _id, token } = action.payload;
            const createdAt = new Date().getTime();
            localStorage.setItem('Authorization', token);
            localStorage.setItem('_id', _id);
            localStorage.setItem('createdAt', createdAt );
            return {
                ...state,
                isUserLoggedIn: true,
                userData: {
                    _id: _id,
                    token: token,
                    createdAt: createdAt
                }
            };
        case authAction.REMOVE_USER_SESSION:
            localStorage.removeItem('Authorization');
            localStorage.removeItem('_id');
            localStorage.removeItem('createdAt');
            return {
                ...state,
                isUserLoggedIn: false,
                userData: {
                    _id: undefined,
                    token: undefined,
                    createdAt: undefined
                }
            }
        default:
            return state;
    }
}
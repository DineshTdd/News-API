import * as logsAction from '../action/logsAction';

const initialState = {
    userActivityLogs: []
};

export default(state= initialState, action) => {
    switch(action.type) {
        
        case logsAction.SET_USER_ACTIVITY_LOGS:
            return {
                ...state,
                userActivityLogs: action.payload.value
            };
        default:
            return state;
    }
}
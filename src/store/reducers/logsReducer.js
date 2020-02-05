import * as logsAction from '../action/logsAction';

const initialState = {
    userActivityLogs: [],
    currentCollectionLogs: [],
    userCollectionLogs: [],
    totalCollectionLogs: 0,
    remainingCollectionLogs: 0,
    fetchedCollectionLogs: 0,
    nextStartRange: 0,
    nextEndRange: 0,
    isFirstVisit: true
};

export default(state= initialState, action) => {
    switch(action.type) {
        
        case logsAction.SET_USER_ACTIVITY_LOGS:
            return {
                ...state,
                userActivityLogs: action.payload.value
            };
        case logsAction.SET_CURRENT_COLLECTION_ACTIVITY_LOGS:
            return {
                ...state,
                currentCollectionLogs: action.payload.value
            };
        case logsAction.SET_COLLECTION_ACTIVITY_LOGS:
            const newState ={
                ...state,
                isFirstVisit: false,
                userCollectionLogs: state.userCollectionLogs.concat(action.payload.documents),
                totalCollectionLogs: action.payload.totalCollectionLogs,
                remainingCollectionLogs: action.payload.remainingCollectionLogs,
                fetchedCollectionLogs: action.payload.fetchedCollectionLogs,
                nextStartRange: action.payload.nextStartRange,
                nextEndRange: action.payload.nextEndRange,
            };
            return newState;
        case logsAction.RESET_LOGS_STATE:
            const initialState = {
                userActivityLogs: [],
                currentCollectionLogs: [],
                userCollectionLogs: [],
                totalCollectionLogs: 0,
                remainingCollectionLogs: 0,
                fetchedCollectionLogs: 0,
                nextStartRange: 0,
                nextEndRange: 0,
                isFirstVisit: true
            };
            return initialState;
        default:
            return state;
    }
}
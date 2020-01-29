import * as userAction from '../action/userAction';

const initialState = {
    userData: {
        userId: '',
        userEmail: '',
        userName: '',
        userJoinedOn: ''
    }
}

export default(state=initialState, action) => {
    switch(action.type) {
        case userAction.SET_USER_DATA:
            const { result } = action.payload.value.data;
            return {
                userData: {
                    userId: result._id,
                    userEmail: result.email,
                    userName: result.name,
                    userJoinedOn: result.date
                }
            };
        default:
            return state;
    }
}
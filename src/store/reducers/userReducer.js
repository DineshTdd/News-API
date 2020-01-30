import * as userAction from '../action/userAction';

const initialState = {
    userData: {
        userId: '',
        userEmail: '',
        userName: '',
        userJoinedOn: '',
        userProfilePicture: null
    }
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
};

export default(state=initialState, action) => {
    switch(action.type) {
        case userAction.SET_USER_DATA:
            const { result } = action.payload.value.data;
            const base64Flag = `data:${result.img.contentType};base64,`;
            const img = base64Flag + arrayBufferToBase64(result.img.data.data);
            return {
                userData: {
                    userId: result._id,
                    userEmail: result.email,
                    userName: result.name,
                    userJoinedOn: result.date,
                    userProfilePicture: img
                }
            };
        default:
            return state;
    }
}
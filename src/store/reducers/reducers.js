import * as newsActions from '../action/action';


const initialState = {
    country: 'in',
    category: 'Business',
    totalPage: 10,
    activePage: 1,
    data: [],
    isNewsFetching: false,
    isFirstVisit: true
};

export default (state = initialState, action) => {
    switch (action.type) {
        // set filter country 
        case newsActions.CHANGE_COUNTRY:
            return {
                ...state,
                country: action.payload.value
            };
        // set filter category
        case newsActions.CHANGE_CATEGORY:
            return {
                ...state,
                category: action.payload.value
            };
        // set current page
        case newsActions.CHANGE_ACTIVE_PAGE:
            return {
                ...state,
                activePage: action.payload.value
            };
        // updates the store with news_items from NEWSAPI
        case newsActions.CHANGE_DATA:
            return {
                ...state,
                totalPage: Math.ceil(action.payload.value.data.count/10),
                data:action.payload.value.data.data
            }
        case newsActions.CHANGE_ISNEWSFETCHING:
            return {
                ...state,
                isNewsFetching: action.payload.value
            }
        case newsActions.TOGGLE_ISFIRSTVISIT:
            return {
                ...state,
                isFirstVisit: action.payload.value
            }
        default: 
            return state;
    }
};
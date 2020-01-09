import * as collectionActions from '../action/collectionAction';

const initialState = {
    formValues: {
        author: '',
        title: '',
        imageUrl: '',
        description: '',
        articleUrl: '',
        sourceName: ''
    },
    newsCollection: [],
    status: 200,
    isValidated: false,
    isEditing: false
}

export default (state=initialState, action) => {
    switch(action.type){
        // Updates the stores form values
        case collectionActions.UPDATE_FORM_VALUES:
            return {
                ...state,
                formValues: action.payload.formValues
            }
        // updates stores collection with fetched articles from PG
        case collectionActions.FETCH_COLLECTION_NEWS:
            return {
                ...state,
                newsCollection: action.payload.value.data.data,
            }
        // isValidated is toggled whenever article is created
        case collectionActions.TOGGLE_IS_VALIDATED:
            return {
                ...state,
                isValidated: !state.isValidated
            }
        // change of status incorrespondence with validation
        case collectionActions.CHANGE_STATUS:
            return {
                ...state,
                status: action.payload.statuscode
            }
        // isEditing is toggled whenever article is edited
        case collectionActions.TOGGLE_IS_EDITING:
            return {
                ...state,
                isEditing: !state.isEditing
            }
        // set form values in store for editing
        case collectionActions.SET_FORM_VALUES:
            return {
                ...state,
                formValues: {
                    author: action.payload.news_item.author,
                    title: action.payload.news_item.title,
                    imageUrl: action.payload.news_item.imageurl,
                    description: action.payload.news_item.description,
                    articleUrl: action.payload.news_item.articleurl,
                    sourceName: action.payload.news_item.source
                },
                isEditing: true
            }
        // clears form values whenever necessary
        case collectionActions.CLEAR_FORM_VALUES:
            return {
                ...state,
                formValues: {
                    author: '',
                    title: '',
                    imageUrl: '',
                    description: '',
                    articleUrl: '',
                    sourceName: ''
                },
                isEditing: false
            }
        default:
            return state;
    }
};
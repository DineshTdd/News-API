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
    isLoading: false,
    isValidated: false,
    isEditing: false,
    isCollectionFetching: false
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
            const {data: news} = action.payload.value.data;
            news.sort(function(x, y){
                return y.articlerating - x.articlerating;
            })
            // news.reverse();
            return {
                ...state,
                newsCollection: news,
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
                isEditing: action.payload.isEditing
            }
        // isLoading is toggled whenever news articles are fetched
        case collectionActions.TOGGLE_IS_LOADING:
            return {
                ...state,
                isLoading: !state.isLoading
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
        case collectionActions.CHANGE_ISCOLLECTIONFETCHING:
        return {
            ...state,
            isCollectionFetching: action.payload.value
        }
        default:
            return state;
    }
};
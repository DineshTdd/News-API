import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore, combineReducers, applyMiddleware } from 'redux'; // standalone redux store import
import { Provider } from 'react-redux'; // connects redux to react
import ReduxThunk from 'redux-thunk';

import newsReducer from './store/reducers/reducers';
import collectionReducer from './store/reducers/collectionReducer';

// Combining two reducers 
// news: used by News Component
// collections: used by Collection Component
const rootReducer = combineReducers({
    news: newsReducer,
    collections: collectionReducer
  });

  // global store for app with ReduxThunk as middleware
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

ReactDOM.render(<Provider store = {store}>
    <App />
</Provider>, document.getElementById('root'));


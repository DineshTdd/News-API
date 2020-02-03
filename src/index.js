import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './components/Login';
import Signup from './components/Signup';
import NoMatch from './components/NoMatch';
import newsReducer from './store/reducers/reducers';
import collectionReducer from './store/reducers/collectionReducer';
import authReducer from './store/reducers/authReducers';
import userReducer from './store/reducers/userReducer';
import logsReducer from './store/reducers/logsReducer';
import { createStore, combineReducers, applyMiddleware } from 'redux'; // standalone redux store import
import { Provider } from 'react-redux'; // connects redux to react
import ReduxThunk from 'redux-thunk';
import { Router } from "react-router-dom";
import { Route, Switch, Redirect } from "react-router";
import {createBrowserHistory} from 'history';
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router'

const browserHistory = createBrowserHistory();


// Combining two reducers 
// news: used by News Component
// collections: used by Collection Component
const rootReducer = (History) => combineReducers({
    router: connectRouter(History),
    news: newsReducer,
    collections: collectionReducer,
    auth: authReducer,
    user: userReducer,
    logs: logsReducer
  });

  // global store for app with ReduxThunk as middleware
const store = createStore(rootReducer(browserHistory), applyMiddleware(routerMiddleware(browserHistory), ReduxThunk));



function PrivateRoute ({component: Component, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => store.getState().auth.isUserLoggedIn === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/'}} />}
    />
  )
}

function AutoLogin ({component: Component, ...rest}) {
  return (
    <Route 
    {...rest}
    render={(props) => store.getState().auth.isUserLoggedIn === true
    ? <Redirect to={{pathname: '/Home'}} />
    : <Component {...props} />}
    />
  )
}


ReactDOM.render(<Provider store = {store}>
  <Router history={browserHistory}>
  <ConnectedRouter history={browserHistory}>
    <Switch>
      <PrivateRoute path='/Home' exact component={App} />
      <AutoLogin path='/' exact component={Login} />
      <Route path='/Signup' exact component={Signup} />
      <Route path='*' component={NoMatch} />
    </Switch>
  </ConnectedRouter>
  </Router>
</Provider>, document.getElementById('root'));


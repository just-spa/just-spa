import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter, Route, hashHistory, Switch } from 'react-router-dom';
import {applyMiddleware, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers/index';

import '../style/css/index.less';

import Index from './pages/index/index';
import Monitor from './pages/monitor/index';
import Search from './pages/search/index';

const initStore = {};
let middlewares = [];

const store = createStore(combineReducers(reducers), initStore, composeWithDevTools(applyMiddleware(...middlewares)));

const App = () => {
    return (
        <Provider store={store}>
            <HashRouter history={hashHistory}>
                <Switch>
                    <Route exact path='/' component={Index} />
                    <Route exact path='/index' component={Index} />
                    <Route exact path='/monitor' component={Monitor} />
                    <Route exact path='/search' component={Search} />
                </Switch>
            </HashRouter>
        </Provider>
    );
}


render(<App />, document.getElementById('root'));
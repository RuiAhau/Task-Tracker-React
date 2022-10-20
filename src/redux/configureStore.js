import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Projects } from './projects';
import {Auth} from './auth';

import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const ConfigureStore = () => {

    const store = createStore(
        combineReducers({
            projects: Projects,
            auth: Auth
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}
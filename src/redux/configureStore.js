import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Projects } from './projects';
import { Users } from './users';
import { Auth } from './auth';

import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const ConfigureStore = () => {

    const store = createStore(
        combineReducers({
            projects: Projects,
            users: Users,
            auth: Auth,
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}
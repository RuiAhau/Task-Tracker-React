import * as ActionTypes from './ActionTypes';

export const Project = (state = {
    errMess: null,
    project: []
}, action) => {

    switch (action.type) {
        case ActionTypes.ADD_PROJECT:
            return {
                ...state,
                errMess: null,
                project: action.payload
            }
        case ActionTypes.PROJECT_FAILED:
            return {
                ...state,
                errMess: action.payload,
                project: []
            }
        default:
            return state;
    }
}; 
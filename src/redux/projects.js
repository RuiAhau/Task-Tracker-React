import * as ActionTypes from './ActionTypes';

export const Projects = (state = {
    errMess: null,
    projects: []
}, action) => {

    switch (action.type) {
        case ActionTypes.ADD_PROJECTS:
            return {
                ...state,
                errMess: null,
                projects: action.payload
            }
        case ActionTypes.PROJECTS_FAILED:
            return {
                ...state,
                errMess: action.payload,
                projects: []
            }
        default:
            return state;
    }
}; 
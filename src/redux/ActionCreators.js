import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseUrl';
import { Redirect } from 'react-router-dom';

/**PROJECTS */
export const fetchProjects = () => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(baseUrl + 'projects', {
        headers: {
            'Authorization': bearer
        }
    })
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(projects => dispatch(addProjects(projects)))
        .catch(error => dispatch(projectsFailed(error.message)));
}

export const projectsFailed = (errmess) => ({
    type: ActionTypes.PROJECTS_FAILED,
    payload: errmess
});

export const addProjects = (projects) => ({
    type: ActionTypes.ADD_PROJECTS,
    payload: projects
});

export const addProject = (project) => ({
    type: ActionTypes.ADD_PROJECT,
    payload: project
});

export const projectFailed = (errmess) => ({
    type: ActionTypes.PROJECT_FAILED,
    payload: errmess
});

export const postProject = (projectName) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');
    const newProject = {
        projectName: projectName,
        devs: [],
        tasks: []
    }

    return fetch(baseUrl + 'projects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        body: JSON.stringify(newProject),
    })
        .then(response => {
            if (response.ok) {
                dispatch(fetchProjects());
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                dispatch(projectFailed(errmess));
                throw errmess;
            })
        .then(response => response.json())
        .catch(error => {
            console.log('Post comments ', error.message);
            alert('Your Project could not be posted\nError: ' + error.message);
        })
}

/**TASKS */
export const postTask = (taskName, taskStatus, projectId) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');

    const newTask = {
        taskName: taskName,
        status: taskStatus,
        dev: [],
        comments: []
    }

    return fetch(baseUrl + 'projects/' + projectId + '/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        body: JSON.stringify(newTask),
    })
        .then(response => {
            if (response.ok) {
                dispatch(fetchProjects());
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                dispatch(taskFailed(errmess));
                throw errmess;
            })
        .then(response => response.json())
        .catch(error => {
            console.log('Post task ', error.message);
            alert('Your Task could not be posted\nError: ' + error.message);
        })
}

export const addTask = (task) => ({
    type: ActionTypes.ADD_TASK,
    payload: task
});

export const taskFailed = (errmess) => ({
    type: ActionTypes.TASK_FAILED,
    payload: errmess
});

/**COMMENTS */
export const postComment = (comment, projectId, taskId) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');

    const newComment = {
        comment: comment
    }

    return fetch(baseUrl + 'projects/' + projectId + '/tasks/' + taskId + '/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        body: JSON.stringify(newComment),
    })
        .then(response => {
            if (response.ok) {
                dispatch(fetchProjects());
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                dispatch(taskFailed(errmess));
                throw errmess;
            })
        .then(response => response.json())
        .catch(error => {
            console.log('Post Comment ', error.message);
            alert('Your Comment could not be posted\nError: ' + error.message);
        })
}

/**LOGIN */
export const requestLogin = (creds) => {
    return {
        type: ActionTypes.LOGIN_REQUEST,
        creds
    }
}

export const receiveLogin = (response) => {
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        token: response.token
    }
}

export const loginError = (message) => {
    return {
        type: ActionTypes.LOGIN_FAILURE,
        message
    }
}

export const loginUser = (creds) => (dispatch) => {
    dispatch(requestLogin(creds))

    return fetch(baseUrl + 'users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(creds)
    })
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                throw error;
            })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                // If login was successful, set the token in local storage
                localStorage.setItem('token', response.token);
                localStorage.setItem('creds', JSON.stringify(creds));
                // Dispatch the success action
                dispatch(fetchProjects());
                dispatch(receiveLogin(response));
            }
            else {
                var error = new Error('Error ' + response.status);
                error.response = response;
                throw error;
            }
        })
        .catch(error => dispatch(loginError(error.message)))
};

export const requestLogout = () => {
    return {
        type: ActionTypes.LOGOUT_REQUEST
    }
}

export const receiveLogout = () => {
    return {
        type: ActionTypes.LOGOUT_SUCCESS
    }
}

export const logoutUser = () => (dispatch) => {
    dispatch(requestLogout());
    localStorage.removeItem('token');
    localStorage.removeItem('creds');
    dispatch(receiveLogout());
    dispatch(fetchProjects());
}

/**USERS */
export const fetchUsers = () => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    return fetch(baseUrl + 'users', {
        headers: {
            'Authorization': bearer
        }
    })
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(users => dispatch(addUsers(users)))
        .catch(error => dispatch(usersFailed(error.message)));
}

export const usersFailed = (errmess) => ({
    type: ActionTypes.USERS_FAILED,
    payload: errmess
});

export const addUsers = (users) => ({
    type: ActionTypes.ADD_USERS,
    payload: users
});

/**DEV */
export const postDev = (projectId, selectedDev) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');

    const newDev = {
        userId: selectedDev
    }
    console.log(JSON.stringify(newDev))

    return fetch(baseUrl + 'projects/' + projectId + '/devs/' + selectedDev, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        body: JSON.stringify(newDev),
    })
        .then(response => {
            if (response.ok) {
                dispatch(fetchProjects());
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                //dispatch(projectFailed(errmess));
                throw errmess;
            })
        .then(response => response.json())
        .catch(error => {
            console.log('Post Dev ', error.message);
            alert('Your Dev could not be posted\nError: ' + error.message);
        })
}
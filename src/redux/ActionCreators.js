import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseUrl';

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

export const postProject = (projectName, projectDesc) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');
    const newProject = {
        projectName: projectName,
        description: projectDesc,
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
                throw errmess;
            })
        .then(response => response.json())
        .catch(error => {
            console.log('Post project ', error.message);
            alert('Your Project could not be posted\nError: ' + error.message);
        })
}

/**TASKS */
export const postTask = (taskName, taskDescription, taskStatus, projectId) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');

    const newTask = {
        taskName: taskName,
        status: taskStatus,
        dev: [],
        description: taskDescription,
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
                throw errmess;
            })
        .then(response => response.json())
        .catch(error => {
            console.log('Post task ', error.message);
            alert('Your Task could not be posted\nError: ' + error.message);
        })
}

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
                throw errmess;
            })
        .then(response => response.json())
        .catch(error => {
            console.log('Post Comment ', error.message);
            alert('Your Comment could not be posted\nError: ' + error.message);
        })
}

/**SIGN UP USER */
export const signUpUser = (registerInfo) => () => {

    const newUser = {
        username: registerInfo.username,
        password: registerInfo.password,
        firstname: registerInfo.firstname,
        lastname: registerInfo.lastname
    }

    console.log(newUser)

    return fetch(baseUrl + 'users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
    })
        .then(response => {
            if (response.ok) {
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
                throw errmess;
            })
        .then(response => response.json())
        .catch(error => {
            console.log('Sign up User ', error.message);
            alert('Your registration could not be completed\nError: ' + error.message);
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
        token: response.token,
        userInfo: response.user
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
                localStorage.setItem('user', JSON.stringify(response.user))
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
    localStorage.removeItem('user')
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
                throw errmess;
            })
        .then(response => response.json())
        .catch(error => {
            console.log('Post Dev ', error.message);
            alert('Your Dev could not be posted in project\nError: ' + error.message);
        })
}

/**Edit status of task */
export const putStatus = (newStatus, projectId, taskId) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');

    const newStatu = {
        status: newStatus
    }

    return fetch(baseUrl + 'projects/' + projectId + '/tasks/' + taskId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        body: JSON.stringify(newStatu)
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
                throw errmess;
            })
        .then(response => response.json())
        .catch(error => {
            console.log('Put Status ', error.message);
            alert('Your Status could not be updated\nError: ' + error.message);
        })
}

/**Edit comments */
export const putComment = (projectId, taskId, commentId, editComment) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');

    const commentEdit = {
        comment: editComment
    }

    return fetch(baseUrl + 'projects/' + projectId + '/tasks/' + taskId + '/comments/' + commentId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        body: JSON.stringify(commentEdit)
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
                throw errmess;
            })
        .then(response => response.json())
        .catch(error => {
            console.log('Put Comment ', error.message);
            alert('Your Comment could not be updated\nError: ' + error.message);
        })
}

export const postDevInTask = (selectedDev, projectId, taskId) => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');

    const newDev = {
        userId: selectedDev
    }

    return fetch(baseUrl + 'projects/' + projectId + '/tasks/' + taskId + '/dev/' + selectedDev, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        body: JSON.stringify(newDev)
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
                throw errmess;
            })
        .then(response => response.json())
        .catch(error => {
            console.log('Post dev ', error.message);
            alert('Your Dev could not be posted in task\nError: ' + error.message);
        })
}

export const deleteComment = (projectId, taskId, commentId) => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'projects/' + projectId + '/tasks/' + taskId + '/comments/' + commentId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
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
                throw errmess;
            })
        .then(response => response.json())
        .catch(error => {
            console.log('Delete comment ', error.message);
            alert('Your comment could not be deleted in task\nError: ' + error.message);
        })
}

export const deleteTask = (projectId, taskId) => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'projects/' + projectId + '/tasks/' + taskId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
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
                throw errmess;
            })
        .then(response => response.json())
        .catch(error => {
            console.log('Delete task ', error.message);
            alert('Your task could not be deleted in task\nError: ' + error.message);
        })
}
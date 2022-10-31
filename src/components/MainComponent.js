import React from 'react';
import TaskDetails from './TaskDetails';
import ProjectDetails from './ProjectDetailComponent';
import Projects from './ProjectComponent';
import Header from './HeaderComponent';
import { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchUsers, fetchProjects, loginUser, logoutUser, postProject, postTask, postComment, postDev, postDevInTask, putStatus, putComment, deleteComment, deleteTask } from '../redux/ActionCreators';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import ProjectAssociated from './ProjectsAssociatedComponent';

const mapStateToProps = state => {
    return {
        projects: state.projects,
        users: state.users,
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => ({
    deleteTask: (projectId, taskId) => { dispatch(deleteTask(projectId, taskId)) },
    deleteComment: (projectId, taskId, commentId) => { dispatch(deleteComment(projectId, taskId, commentId)) },
    putComment: (projectId, taskId, commentId, editComment) => { dispatch(putComment(projectId, taskId, commentId, editComment)) },
    putStatus: (newStatus, projectId, taskId) => { dispatch(putStatus(newStatus, projectId, taskId)) },
    postDevInTask: (selectedDev, projectId, taskId) => { dispatch(postDevInTask(selectedDev, projectId, taskId)) },
    postDev: (projectId, selectedDev) => { dispatch(postDev(projectId, selectedDev)) },
    postComment: (comment, projectId, taskId) => { dispatch(postComment(comment, projectId, taskId)) },
    postTask: (taskName, taskStatus, projectId) => { dispatch(postTask(taskName, taskStatus, projectId)) },
    postProject: (projectName, projectDesc) => { dispatch(postProject(projectName, projectDesc)) },
    fetchUsers: () => { dispatch(fetchUsers()) },
    fetchProjects: () => { dispatch(fetchProjects()) },
    loginUser: (creds) => dispatch(loginUser(creds)),
    logoutUser: () => dispatch(logoutUser())
});

class Main extends Component {

    componentDidMount() {
        this.props.fetchProjects();
        this.props.fetchUsers();
    }

    render() {

        const ProjectWithDetails = ({ match }) => {
            return (
                <ProjectDetails project={this.props.projects.projects.filter((project) => project._id === match.params.projectId)[0]}
                    deleteTask={this.props.deleteTask}
                    postTask={this.props.postTask}
                    users={this.props.users}
                    postDev={this.props.postDev}
                    auth={this.props.auth} />
            );
        }

        return (
            <>
                <Header auth={this.props.auth} loginUser={this.props.loginUser} logoutUser={this.props.logoutUser} />
                <TransitionGroup>
                    <CSSTransition key={this.props.location.key} classNames='page' timeout={300}>
                        <Switch>
                            <Route exact path="/projects" component={() => <Projects projects={this.props.projects}
                                auth={this.props.auth}
                                postProject={this.props.postProject} />} />
                            <Route path="/projects/:projectId/tasks/:taskId" render={(props) => <TaskDetails projects={this.props.projects} users={this.props.users} {...props}
                                auth={this.props.auth}
                                deleteComment={this.props.deleteComment}
                                putStatus={this.props.putStatus}
                                putComment={this.props.putComment}
                                postComment={this.props.postComment}
                                postDevInTask={this.props.postDevInTask} />} />
                            <Route path="/projects/:projectId" component={ProjectWithDetails} />
                            <Route path="/projectsassociated" component={() => <ProjectAssociated projects={this.props.projects} auth={this.props.auth}/>} />
                            <Redirect to="/projects" />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
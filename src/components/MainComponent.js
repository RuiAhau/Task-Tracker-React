import React from 'react';
import TaskDetails from './TaskDetails';
import ProjectDetails from './ProjectDetailComponent';
import Projects from './ProjectComponent';
import Header from './HeaderComponent';
import { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchProjects, loginUser, logoutUser, postProject } from '../redux/ActionCreators';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const mapStateToProps = state => {
    return {
        projects: state.projects,
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => ({
    postProject: (devs, tasks) => { dispatch(postProject(devs, tasks)) },
    fetchProjects: () => { dispatch(fetchProjects()) },
    loginUser: (creds) => dispatch(loginUser(creds)),
    logoutUser: () => dispatch(logoutUser())
});

class Main extends Component {

    componentDidMount() {
        this.props.fetchProjects();
    }

    render() {

        const ProjectWithDetails = ({ match }) => {
            return (
                <ProjectDetails project={this.props.projects.projects.filter((project) => project._id === match.params.projectId)[0]} />
            );
        }

        return (
            <div>
                <Header auth={this.props.auth} loginUser={this.props.loginUser} logoutUser={this.props.logoutUser} />
                <TransitionGroup>
                    <CSSTransition key={this.props.location.key} classNames='page' timeout={300}>
                        <Switch>
                            <Route exact path="/projects" component={() => <Projects projects={this.props.projects} postProject={this.props.postProject} />} />
                            <Route path="/projects/:projectId/tasks/:taskId" render={(props) => <TaskDetails projects={this.props.projects} {...props} />} />
                            <Route path="/projects/:projectId" component={ProjectWithDetails} />
                            <Redirect to="/projects" />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
import React from 'react';
import { Card, CardImg, CardImgOverlay, CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';

function RenderTaskDetails({ task }) {
    const comments = task.comments.map((comment) => {
        return (
            <ul>

            </ul>
        );
    })

    const devs = task.dev.map((dev) => {
        return (
            <ul className='list unstyled mt-3'>
                <p>{dev.firstname} {dev.lastname}</p>
                <hr />
            </ul>
        );
    })
    return (
        <div className='container'>
            <div className='row'>
                <h3 className='col-6'>Dev</h3>
                <h3 className='col-6'>Comments</h3>
            </div>
            <div className='row'>
                <div className='col-6'>{devs}</div>
                <div className='col-6'>{comments}</div>
            </div>
        </div>
    );
}

const TaskDetails = (props) => {

    const project = props.projects.projects.filter((project) => project._id === props.match.params.projectId)[0];
    const task = project.tasks.filter((task) => task._id === props.match.params.taskId)[0];

    return (
        <div className='container'>
            <h3>Task Details of {task._id}</h3>
            <h2>Status: {task.status}</h2>
            <RenderTaskDetails task={task} />
        </div>
    );
}

export default TaskDetails;
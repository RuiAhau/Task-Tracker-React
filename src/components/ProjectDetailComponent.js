import React from 'react';
import { Card, CardImg, CardImgOverlay, CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from "react-router-dom";


function RenderProjectDetails({ project }) {

    const tasks = project.tasks.map((task) => {
        return (
                <Card key={task._id}>
                    <Link to={`/projects/${project._id}/tasks/${task._id}`}>
                        <CardTitle>{task._id} {task.status}</CardTitle>
                    </Link>
                </Card>


        );
    });

    return (
        <div className='container'>
            <div className="row">
                <h3 className="col-6">Devs</h3>
                <h3 className="col-6">Tasks</h3>
            </div>
            <div className="row">
                <div className="col-6">
                    <Card>{project.devs}</Card>
                </div>
                <div className="col-6">
                    <Card>{tasks}</Card>
                </div>
            </div>
            <div className="row">
                <h5>Creator of the Project: {project.creator.firstname} {project.creator.role}</h5>
            </div>
        </div>
    );
}



const ProjectDetails = (props) => {
    return (
        <div className="container">
            <h3>Project Details of {props.project._id}</h3>
            <RenderProjectDetails project={props.project} />
        </div>
    );
}

export default ProjectDetails;
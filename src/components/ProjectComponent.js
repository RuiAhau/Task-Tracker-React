import React from 'react';
import { Card, CardImg, CardImgOverlay, CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from "react-router-dom";

function RenderProject({ project }) {
    return (
        <div className='col-12'>
            <Card className='mt-3' key={project._id}>
                <Link to={`/projects/${project._id}`}>
                    <CardTitle>{project._id}</CardTitle>
                </Link>
            </Card>
        </div>

    );
}

const Projects = (props) => {

    const projects = props.projects.projects.map((project) => {
        return (
            <div key={project._id} className='col-6'>
                <RenderProject project={project} />
            </div>
        );
    });

    return (
        <div className="container">
            <div className="col-12">
                <h3>List of Projects</h3>
                <hr />
            </div>
            <div className='row'>
                {projects}
            </div>
        </div>
    );
}

export default Projects;
import React from 'react';
import { Link } from "react-router-dom";
import { CompoundButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react';

const ProjectAssociated = ({ projects, auth }) => {

    const projectsAssociated = projects.projects.filter((project) => project.devs.filter((dev) => dev.username === auth.user.username))

    const mapProjects = projectsAssociated.map(project => {
        return (
            <div className='col-3'>
                <Link to={`/projects/${project._id}`}>
                    {project.creator.username === auth.user.username ?
                        <CompoundButton primary secondaryText={`Manager: ${project.creator.firstname}`}>
                            {project.projectName}
                        </CompoundButton>
                        :
                        <CompoundButton secondaryText={`Manager: ${project.creator.firstname}`}>
                            {project.projectName}
                        </CompoundButton>
                    }
                </Link>
            </div>
        );
    })

    return (
        <div className='container'>
            <div className='col-12'>
                <h3>Associated Projects</h3>
                <hr />
                <Stack horizontal className='container flex-wrap' style={{ rowGap: 15 }}>
                    {mapProjects}
                </Stack>
            </div>

        </div>
    );
}

export default ProjectAssociated;
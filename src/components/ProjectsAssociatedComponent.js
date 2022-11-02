import React from 'react';
import { Link } from "react-router-dom";
import { CompoundButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react';

const ProjectAssociated = ({ projects, auth }) => {

    const projectsAssociated = projects.projects.map((project => {
        var dev1 = undefined;
        project.devs.map((dev => {
            if (dev.username === auth.user?.username) {
                dev1 = dev;
                return;
            }
        }))
        if (dev1?.username === auth.user.username) {
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
        }
    }));

    return (
        <div className='container'>
            <div className='col-12'>
                <h3>Projects you are involved</h3>
                <hr />
                <Stack horizontal className='container flex-wrap' style={{ rowGap: 15 }}>
                    {projectsAssociated}
                </Stack>
            </div>

        </div>
    );
}

export default ProjectAssociated;
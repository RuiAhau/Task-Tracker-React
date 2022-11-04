import React from 'react';
import { Link } from "react-router-dom";
import { CompoundButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react';

import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { useState } from 'react';

const ProjectAssociated = ({ projects, auth }) => {

    const [checked, setChecked] = useState(false);

    const handleCheck = () => {
        setChecked(!checked)
    }

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

    const tasksNeeded = projects.projects.map((project) => {
        return (
            project.tasks.map((task => {
                if (task.dev[0]?.username === auth.user?.username &&
                    (task.status === 'waiting' || task.status === 'implementation')) {
                    return (
                        <div className='col-3'>
                            <Link to={`/projects/${project._id}/tasks/${task._id}`}>
                                <CompoundButton secondaryText={`${task.status}`}>{task.taskName}</CompoundButton>
                            </Link>
                        </div>
                    );
                }
            }))
        );
    })

    return (
        <>

            <div className='container'>
                <div className='col-4'>
                    <Checkbox
                        onChange={handleCheck}
                        checked={checked}
                        label='Show my tasks'
                        boxSide="end" />
                </div>
                <div className='col-12'>
                    {!checked ?
                        <h3>Projects you are involved</h3>
                        :
                        <h3>Tasks that need to be completed</h3>
                    }

                </div>
                <hr />
                <div className='container'>
                    {!checked ?
                        <Stack horizontal className='container flex-wrap' style={{ rowGap: 15 }}>
                            {projectsAssociated}
                        </Stack>
                        :
                        <Stack horizontal className='container flex-wrap' style={{ rowGap: 15 }}>
                            {tasksNeeded}
                        </Stack>
                    }
                </div>
            </div>
        </>
    );
}

export default ProjectAssociated;
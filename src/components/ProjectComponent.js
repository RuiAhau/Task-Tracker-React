import React, { useState } from 'react';
import { Form, FormGroup } from 'reactstrap';
import { Link } from "react-router-dom";
import { Stack } from '@fluentui/react';
import { CompoundButton, PrimaryButton, IconButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { useId } from '@fluentui/react-hooks';

import { contentStyles, cancelIcon, iconButtonStyles } from './ModalStyles';
import { Modal, MessageBar, MessageBarType } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';

function RenderProject({ project, auth }) {

    return (
        <div className='col-3'>
            <Link to={`/projects/${project._id}`}>
                {project.creator.username === auth.user.username ?
                    <CompoundButton className='project-box' primary secondaryText={`Manager: ${project.creator.firstname}`}>
                        {project.projectName}
                    </CompoundButton>
                    :
                    <CompoundButton className='project-box' secondaryText={`Manager: ${project.creator.firstname}`}>
                        {project.projectName}
                    </CompoundButton>
                }
            </Link>
        </div>
    );
}

const Projects = (props) => {

    const [modalIsOpen, setModalState] = useState(false);

    const setModalOpenClose = () => {
        setModalState(!modalIsOpen)
    }

    const [projectName, setProjectName] = useState('');

    const handleInputChange = event => {
        setProjectName(event.target.value);
    }

    const [projectDesc, setProjectDesc] = useState('');

    const handleInputChangeDesc = event => {
        setProjectDesc(event.target.value);
    }

    const handleCreateProject = (event) => {
        setModalState(!modalIsOpen)
        props.postProject(projectName, projectDesc);
        event.preventDefault();

    }

    const projects = props.projects.projects.map((project) => {
        return (
            <>
                {props.auth.user ?
                    <RenderProject project={project} auth={props.auth} />
                    :
                    <div></div>
                }
            </>
        );
    });

    const titleId = useId('title');

    const getErrorMessage = (value) => {
        if (value.length <= 3)
            return 'Project must have more than 3 characters!'
    }

    return (
        <>
            {props.auth.isAuthenticated ?
                <div className="container">
                    <div className="col-12">
                        <h3>List of Projects</h3>
                    </div>
                    <div className='container project-details-box-sides mt-4'>
                        <Stack horizontal className='container flex-wrap' style={{ rowGap: 15 }}>
                            {props.auth.userInfo?.role === 'manager' ?
                                <div className='col-3'>
                                    <CompoundButton onClick={setModalOpenClose}>Create Project<Icon className='ml-1' iconName='Add' /></CompoundButton>
                                </div>
                                :
                                <></>
                            }
                            {projects}
                        </Stack>
                    </div>
                </div>
                :
                <div>Not Logged in!</div>
            }

            <Modal
                titleAriaId={titleId}
                isOpen={modalIsOpen}
                onDismiss={setModalOpenClose}
                isBlocking={false}
                containerClassName={contentStyles.container}
                dragOptions={false}
            >
                <div className={contentStyles.header}>
                    <span id={titleId}>Create Project</span>
                    <IconButton
                        styles={iconButtonStyles}
                        iconProps={cancelIcon}
                        ariaLabel="Close popup modal"
                        onClick={setModalOpenClose}>
                    </IconButton>
                </div>
                <div className={contentStyles.body}>
                    <Form onSubmit={handleCreateProject}>
                        <FormGroup>
                            <TextField label="Project Name"
                                required
                                onChange={handleInputChange}
                                value={projectName}
                                validateOnLoad={false}
                                validateOnFocusOut={true}
                                onGetErrorMessage={getErrorMessage} />

                        </FormGroup>
                        <FormGroup>
                            <TextField label="Description"
                                multiline
                                autoAdjustHeight
                                required
                                onChange={handleInputChangeDesc}
                                value={projectDesc} />
                            {projectDesc === '' ?
                                <MessageBar
                                    messageBarType={MessageBarType.info}
                                    isMultiline={false}
                                    dismissButtonAriaLabel="Close"
                                >
                                    Project must have a description!
                                </MessageBar>
                                :
                                <></>
                            }
                        </FormGroup>
                        {projectName.length <= 3 || projectDesc.length <= 10 ?
                            <PrimaryButton disabled type='submit' value='submit'>Create</PrimaryButton>
                            :
                            <PrimaryButton type='submit' value='submit'>Create</PrimaryButton>
                        }
                    </Form>
                </div>
            </Modal>
        </>
    );
}

export default Projects;
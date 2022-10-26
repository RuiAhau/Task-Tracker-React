import React, { useState } from 'react';
import { Form, FormGroup } from 'reactstrap';
import { Link } from "react-router-dom";
import { Stack } from '@fluentui/react';
import { CompoundButton, DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { getTheme, mergeStyleSets, FontWeights, Modal } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';

function RenderProject({ project, auth }) {

    return (
        <div className='col-3'>
            <Link to={`/projects/${project._id}`}>
                {project.creator.username === auth.user.username ?
                    <CompoundButton primary secondaryText={`${project.description}`}>
                        {project.projectName}
                    </CompoundButton>
                    :
                    <CompoundButton secondaryText={`${project.description}`}>
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
            <RenderProject project={project} auth={props.auth} />
        );
    });

    const theme = getTheme();
    const contentStyles = mergeStyleSets({
        container: {
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'stretch',
        },
        header: [
            theme.fonts.xLargePlus,
            {
                flex: '1 1 auto',
                borderTop: `4px solid ${theme.palette.themePrimary}`,
                color: theme.palette.neutralPrimary,
                display: 'flex',
                alignItems: 'center',
                fontWeight: FontWeights.semibold,
                padding: '12px 12px 14px 24px',
            },
        ],
        body: {
            flex: '4 4 auto',
            padding: '0 24px 24px 24px',
            overflowY: 'hidden',
            selectors: {
                p: { margin: '14px 0' },
                'p:first-child': { marginTop: 0 },
                'p:last-child': { marginBottom: 0 },
            },
        },
    });

    const titleId = useId('title');

    return (
        <>
            <div className="container">
                <div className="col-12">
                    <h3>List of Projects</h3>
                    <hr />
                </div>
                <div className='container'>
                    <Stack horizontal className='container flex-wrap' style={{ rowGap: 15 }}>
                        {projects}
                    </Stack>
                </div>
                <hr />
                <div className='row'>
                    <div className='col-6'><DefaultButton onClick={setModalOpenClose}>Create Project</DefaultButton></div>
                </div>
            </div>

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
                </div>
                <div className={contentStyles.body}>
                    <Form onSubmit={handleCreateProject}>
                        <FormGroup>
                            <TextField label="Project Name" onChange={handleInputChange} value={projectName} />
                        </FormGroup>
                        <FormGroup>
                            <TextField label="Description" multiline autoAdjustHeight onChange={handleInputChangeDesc} value={projectDesc} />
                        </FormGroup>
                        <PrimaryButton type='submit' value='submit'>Create</PrimaryButton>
                    </Form>
                </div>

            </Modal>


        </>
    );
}

export default Projects;
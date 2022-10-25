import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Input } from 'reactstrap';
import { Link } from "react-router-dom";
import { Stack } from '@fluentui/react';
import { CompoundButton, DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Label } from '@fluentui/react/lib/Label';
import { TextField, MaskedTextField } from '@fluentui/react/lib/TextField';

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
        console.log(event.target.value)
        setProjectName(event.target.value);
    }

    const [projectDesc, setProjectDesc] = useState('');

    const handleInputChangeDesc = event => {
        console.log(event.target.value)
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

            <Modal isOpen={modalIsOpen} toggle={setModalOpenClose}>
                <ModalHeader toggle={setModalOpenClose}>Create Project</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleCreateProject}>
                        <FormGroup>
                            <TextField label="Project Name" onChange={handleInputChange} value={projectName} />
                        </FormGroup>
                        <FormGroup>
                            <TextField label="Description" onChange={handleInputChangeDesc} value={projectDesc} />
                        </FormGroup>
                        <PrimaryButton type='submit' value='submit'>Create</PrimaryButton>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    );
}

export default Projects;
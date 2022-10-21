import React, { useState } from 'react';
import { Card, CardTitle, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';
import { Link } from "react-router-dom";

function RenderProject({ project }) {
    return (
        <div className='col-12'>
            <Card className='mt-3' key={project._id}>
                <Link to={`/projects/${project._id}`}>
                    <CardTitle>{project.projectName}</CardTitle>
                </Link>
            </Card>
        </div>

    );
}

const Projects = (props) => {

    const [modalIsOpen, setModalState] = useState(false);

    const setModalOpenClose = () => {
        setModalState(!modalIsOpen)
    }

    var [projectName, setProjectName] = useState('');

    const handleInputChange = event => {
        setProjectName(event.target.value);
    }

    const handleCreateProject = (event) => {
        setModalState(!modalIsOpen)
        props.postProject(projectName);
        event.preventDefault();
    }

    const projects = props.projects.projects.map((project) => {
        return (
            <div key={project._id} className='col-6'>
                <RenderProject project={project} />
            </div>
        );
    });

    return (
        <>
            <div className="container">
                <div className="col-12">
                    <h3>List of Projects</h3>
                    <hr />
                </div>
                <div className='row'>
                    {projects}
                </div>
                <hr />
                <div className='row'>
                    <div className='col-6'><Button onClick={setModalOpenClose}>Create Project</Button></div>
                </div>
            </div>

            <Modal isOpen={modalIsOpen} toggle={setModalOpenClose}>
                <ModalHeader toggle={setModalOpenClose}>Create Project</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleCreateProject}>
                        <FormGroup>
                            <Label htmlFor='projectName'>Project Name</Label>
                            <Input type='text' id='projectName' name='projectName'
                                onChange={handleInputChange} value={projectName} />
                        </FormGroup>
                        <Button type='submit' value='submit'>Create</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    );
}

export default Projects;
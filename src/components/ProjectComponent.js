import React, { useState } from 'react';
import { Card, CardTitle, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';
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

    const [modalIsOpen, setModalState] = useState(false);

    const setModalOpenClose = () => {
        setModalState(!modalIsOpen)
    }

    var [devs, setDevsState] = useState('');

    var setDevsValue = (devs) => {
        setDevsState(devs)
    }

    var [tasks, setTasksState] = useState('');

    var setTasksValue = (tasks) => {
        setTasksState(tasks)
    }

    const handleCreateProject = (event) => {
        setModalState(!modalIsOpen)
        props.postProject({ devs: devs, tasks: tasks });
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
                            <Label htmlFor='devs'>Developers</Label>
                            <Input type='text' id='devs' name='devs'
                                innerRef={(input) => setDevsValue(input)} />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor='tasks'>Tasks</Label>
                            <Input type='text' id='tasks' name='tasks'
                                innerRef={(input) => setTasksValue(input)} />
                        </FormGroup>
                        <Button type='submit' value='submit'>Create</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    );
}

export default Projects;
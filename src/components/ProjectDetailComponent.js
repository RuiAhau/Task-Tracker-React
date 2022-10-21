import React, { useState } from 'react';
import { Card, CardTitle, Button, Modal, ModalHeader, ModalBody, FormGroup, Form, Label, Input } from 'reactstrap';
import { Link } from "react-router-dom";
import { Control } from 'react-redux-form';

function RenderProjectDetails({ project }) {

    const devs = project.devs.map((dev) => {
        return (
            <Card>
                <CardTitle>{dev.firstname} {dev.lastname} -- {dev.role}</CardTitle>
            </Card>
        );
    })

    const tasks = project.tasks.map((task) => {
        return (
            <Card key={task._id}>
                <Link to={`/projects/${project._id}/tasks/${task._id}`}>
                    <CardTitle>{task.taskName} - {task.status}</CardTitle>
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
                    <Card>{devs}</Card>
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

    var [modalTaskIsOpen, setModalState] = useState(false);

    const setModalTaskState = () => {
        setModalState(!modalTaskIsOpen)
    }

    var [modalAssignDevIsOpen, setModalDevState] = useState(false);

    const setModalDevsState = () => {
        setModalDevState(!modalAssignDevIsOpen)
    }

    var [taskName, setTaskName] = useState('');

    const handleInputTaskNameChange = event => {
        setTaskName(event.target.value);
    }

    var [taskStatus, setTaskStatus] = useState('');

    const handleInputTaskStatusChange = event => {
        setTaskStatus(event.target.value);
    }

    const [selectedDev, setSelectedDev] = useState('');

    const handleSelectedDevChange = (event) => {
        setSelectedDev(event.target.value);
        console.log('handle do select', selectedDev)
    }

    const handleCreateTask = (event) => {
        setModalState(!modalTaskIsOpen)
        props.postTask(taskName, taskStatus, props.project._id);
        event.preventDefault();
    }

    const handleAssignDev = (event) => {
        setModalDevState(!modalAssignDevIsOpen)
        console.log('Este é o selected dev: ', selectedDev)
        debugger;
        props.postDev(props.project._id, selectedDev);
        event.preventDefault();
    }

    const optionsDevs = props.users.users.map((dev) => {
        return (
            <option value={dev._id}>
                {dev.firstname} {dev.lastname} -- {dev.role}
            </option>
        );
    })

    return (
        <>
            <div className="container">
                <h3>Project Details of {props.project.projectName}</h3>
                <RenderProjectDetails project={props.project} />
            </div>
            <hr />
            <div className='row'>
                <div className='col-6'><Button onClick={setModalDevsState}>Assign Developer</Button></div>
                <div className='col-6'><Button onClick={setModalTaskState}>Create Task</Button></div>
            </div>

            <Modal isOpen={modalTaskIsOpen} toggle={setModalTaskState} >
                <ModalHeader toggle={setModalTaskState}>Create Task</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleCreateTask}>
                        <FormGroup>
                            <Label htmlFor='taskName'>Task Name</Label>
                            <Input type='text' id='taskName' name='taskName'
                                onChange={handleInputTaskNameChange} value={taskName} />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor='status'>Status</Label>
                            <Input type='text' id='status' name='status'
                                onChange={handleInputTaskStatusChange} value={taskStatus} />
                        </FormGroup>
                        <Button type='submit' value='submit'>Create</Button>
                    </Form>
                </ModalBody>
            </Modal>

            <Modal isOpen={modalAssignDevIsOpen} toggle={setModalDevsState}>
                <ModalHeader toggle={setModalDevsState}>Create Task</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleAssignDev}>
                        <FormGroup>
                            <Label htmlFor='devs'>Devs </Label>
                            <select onChange={(e) => setSelectedDev(e.target.value)}
                                value={selectedDev}>
                                {optionsDevs}
                            </select>
                        </FormGroup>
                        <Button type='submit' value='submit'>Assign Dev</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    );
}

export default ProjectDetails;
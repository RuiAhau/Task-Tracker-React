import React, { useState } from 'react';
import { Card, CardTitle, Modal, ModalHeader, ModalBody, FormGroup, Form, Input } from 'reactstrap';
import { Link } from "react-router-dom";
import { DefaultButton, PrimaryButton, CompoundButton } from '@fluentui/react/lib/Button';
import { Label } from '@fluentui/react/lib/Label';
import { TextField } from '@fluentui/react/lib/TextField';

import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from '@fluentui/react/lib/Dropdown';

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
            <Link to={`/projects/${project._id}/tasks/${task._id}`}>
                <CompoundButton className='col' secondaryText={`${task.status}`}>{task.taskName}</CompoundButton>
            </Link>
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
                    {devs}
                </div>
                <div className="col-6">
                    {tasks}
                </div>
            </div>
            <div className="row">
                <h5>Creator of the Project: {project.creator.firstname} - {project.creator.role}</h5>
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

    const [selectedDev, setSelectedDev] = useState();

    const handleSelectedDevChange = (event, item) => {
        console.log(item.key)
        setSelectedDev(item.key);
    }

    const [selectedStatus, setSelectedStatus] = useState();

    const onSelectStatusChange = (event, item) => {
        setSelectedStatus(item.key);
    };

    const handleCreateTask = (event) => {
        setModalState(!modalTaskIsOpen)
        props.postTask(taskName, selectedStatus, props.project._id);
        event.preventDefault();
    }

    const handleAssignDev = (event) => {
        setModalDevState(!modalAssignDevIsOpen)
        props.postDev(props.project._id, selectedDev);
        event.preventDefault();
    }

    const optionsDevs = props.users.users.map((dev) => {
        return (
                {key: `${dev._id}`, text: `${dev.firstname} ${dev.lastname} - ${dev.role}`}
        );
    })

    const dropdownStyles = { dropdown: { width: 300 } };

    const dropdownTaskOptions = [
        { key: 'waiting', text: 'Waiting' },
        { key: 'implementation', text: 'Implementation' },
        { key: 'verifying', text: 'Verifying' },
        { key: 'releasing', text: 'Releasing' }
    ];

    return (
        <>
            {props.project ?
                <div className="container">
                    <h3>Project Details of {props.project.projectName}</h3>
                    <RenderProjectDetails project={props.project} />
                </div>
                :
                <div>
                    Not Loaded!
                </div>}
            <hr />
            <div className='row'>
                <div className='col-6'><DefaultButton onClick={setModalDevsState}>Assign Developer</DefaultButton></div>
                <div className='col-6'><DefaultButton onClick={setModalTaskState}>Create Task</DefaultButton></div>
            </div>

            <Modal isOpen={modalTaskIsOpen} toggle={setModalTaskState} >
                <ModalHeader toggle={setModalTaskState}>Create Task</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleCreateTask}>
                        <FormGroup>
                            <TextField label='Task Name' onChange={handleInputTaskNameChange} value={taskName}/>
                        </FormGroup>
                        <FormGroup>
                            <Dropdown
                                label="Status"
                                selectedKey={selectedStatus ? selectedStatus.key : undefined}
                                onChange={onSelectStatusChange}
                                placeholder="Select a status"
                                options={dropdownTaskOptions}
                                styles={dropdownStyles}
                            />
                        </FormGroup>
                        <PrimaryButton type='submit' value='submit'>Create</PrimaryButton>
                    </Form>
                </ModalBody>
            </Modal>

            <Modal isOpen={modalAssignDevIsOpen} toggle={setModalDevsState}>
                <ModalHeader toggle={setModalDevsState}>Create Task</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleAssignDev}>
                        <FormGroup>
                            <Dropdown
                                label="Devs"
                                selectedKey={selectedDev ? selectedDev.key : undefined}
                                onChange={handleSelectedDevChange}
                                placeholder="Select a Dev"
                                options={optionsDevs}
                                styles={dropdownStyles}
                            />
                        </FormGroup>
                        <PrimaryButton type='submit' value='submit'>Assign Dev</PrimaryButton>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    );
}

export default ProjectDetails;
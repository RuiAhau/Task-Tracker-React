import React, { useState } from 'react';
import { FormGroup, Form } from 'reactstrap';
import { DefaultButton, PrimaryButton, IconButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { Modal, MessageBar, MessageBarType } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { Persona, PersonaSize, PersonaPresence } from '@fluentui/react/lib/Persona';
import { Stack } from '@fluentui/react/lib/Stack';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { DetailsList, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { dropdownStyles, dropdownTaskOptions } from './DropdownStyles'

import { contentStyles, cancelIcon, iconButtonStyles } from './ModalStyles';
import { controlStyles, columns } from './DetailsListColumns';
import { Icon } from '@fluentui/react/lib/Icon';

export var project1 = undefined;

export var deleteT = undefined;

export const handleDeleteTask = (projectId, taskId) => {
    deleteT(projectId, taskId);
}

function RenderAssignees({ project }) {

    const devs = project.devs.map((dev) => {
        const persona = {
            text: `${dev.firstname} ${dev.lastname}`,
            secondaryText: `${dev.role}`
        };

        return (
            <Persona
                {...persona}
                size={PersonaSize.size8}
                presence={PersonaPresence.offline}
                hidePersonaDetails={false}
                imageAlt={`${dev.firstname} ${dev.lastname}, no presence detected`}
            />
        );
    });

    return (
        <Stack className='project-devs col' tokens={{ childrenGap: 10 }}>
            {devs}
        </Stack>
    );
}

function RenderTasks({ project, deleteTask }) {

    project1 = project
    deleteT = deleteTask

    const [filter, setFilter] = useState('')
    const onChangeFilter = (event) => {
        setFilter(event.target.value)
    }

    return (
        <>
            <div className="row mt-3">
                <h3 className="col-2">Tasks<Icon className='ml-2' iconName='TaskGroup' /></h3>
            </div>
            <div className="row">
                <TextField className='col' label="Filter by task name:" onChange={onChangeFilter} styles={controlStyles} />
                <DetailsList
                    items=
                    {filter === '' ?
                        project.tasks
                        :
                        project.tasks.filter((task) => task.taskName.toLowerCase().indexOf(filter) > -1)
                    }
                    selectionMode={SelectionMode.none}
                    columns={columns} />
            </div>
        </>
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

    const [taskName, setTaskName] = useState('');

    const handleInputTaskNameChange = event => {
        setTaskName(event.target.value);
    }

    const [taskDescription, setTaskDescription] = useState('')

    const handleInputTaskDescriptionChange = event => {
        setTaskDescription(event.target.value);
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
        props.postTask(taskName, taskDescription, selectedStatus, props.project._id);
        event.preventDefault();
    }

    const handleAssignDev = (event) => {
        setModalDevState(!modalAssignDevIsOpen)
        props.postDev(props.project._id, selectedDev);
        event.preventDefault();
    }

    const optionsDevs = props.users.users.map((dev) => {
        return (
            { key: `${dev._id}`, text: `${dev.firstname} ${dev.lastname} - ${dev.role}` }
        );
    })

    const titleId = useId('title');

    return (
        <>
            {props.project ?
                <>
                    <div className="container">
                        <h3>{props.project.projectName}'s Details</h3>

                        <div className='project-details-box'>
                            <div className='row'>
                                <h5 className='ml-4'>Project Creator: {props.project.creator.firstname} - {props.project.creator.role}</h5>
                            </div>
                            <div className='row mt-5'>
                                <h5 className='ml-4'>Description</h5>
                                <h5 className='users-title col mr-4'>Assignees</h5>
                            </div>
                            <div className='row'>
                                <p className='project-description col-5'>{props.project.description}</p>
                                <RenderAssignees project={props.project} />
                            </div>
                        </div>

                        <RenderTasks project={props.project} deleteTask={props.deleteTask} />
                    </div>
                    <div className='container'>
                        <div className='row mt-2'>
                            <hr />
                            {props.auth.userInfo?.role === 'manager' ?
                                <>
                                    <div className='col-6'><DefaultButton onClick={setModalDevsState}><Icon className='mr-1' iconName='Assign' />Assign Developer</DefaultButton></div>
                                    <div className='col-6'><DefaultButton onClick={setModalTaskState}><Icon className='mr-1' iconName='TaskSolid' />Create Task</DefaultButton></div>
                                </>
                                :
                                <>

                                    <div className='col'><DefaultButton onClick={setModalTaskState}>Create Task</DefaultButton></div>
                                </>
                            }
                        </div>
                    </div>
                </>
                :
                <div>
                    Not Logged in!
                </div>
            }

            <Modal
                titleAriaId={titleId}
                isOpen={modalTaskIsOpen}
                onDismiss={setModalTaskState}
                isBlocking={false}
                containerClassName={contentStyles.container}
                dragOptions={false}
            >
                <div className={contentStyles.header}>
                    <span id={titleId}>Create Task</span>
                    <IconButton
                        styles={iconButtonStyles}
                        iconProps={cancelIcon}
                        ariaLabel="Close popup modal"
                        onClick={setModalTaskState}>
                    </IconButton>
                </div>
                <div className={contentStyles.body}>
                    <Form onSubmit={handleCreateTask}>
                        <FormGroup>
                            <TextField label='Task Name'
                                required
                                onChange={handleInputTaskNameChange}
                                value={taskName}
                                validateOnLoad={false}
                                validateOnFocusOut={true}
                                onGetErrorMessage={value => {
                                    if (value.length <= 3)
                                        return 'Task must have more than 3 characters!'
                                }} />
                        </FormGroup>
                        <FormGroup>
                            <TextField label='Task Description'
                                required
                                multiline
                                autoAdjustHeight
                                onChange={handleInputTaskDescriptionChange}
                                value={taskDescription}
                                validateOnLoad={false}
                                validateOnFocusOut={true}
                                onGetErrorMessage={value => {
                                    if (value.length <= 10)
                                        return 'Task must have more than 10 characters!'
                                }} />
                            {taskDescription === '' ?
                                <MessageBar
                                    messageBarType={MessageBarType.info}
                                    isMultiline={false}
                                    dismissButtonAriaLabel="Close"
                                >
                                    Task must have a description!
                                </MessageBar>
                                :
                                <></>
                            }
                        </FormGroup>
                        <FormGroup>
                            <Dropdown
                                label="Status"
                                selectedKey={selectedStatus ? selectedStatus.key : undefined}
                                onChange={onSelectStatusChange}
                                placeholder="Select a status"
                                options={dropdownTaskOptions}
                                styles={dropdownStyles}
                                defaultSelectedKey={['waiting']}
                            />
                        </FormGroup>
                        {taskName.length <= 3 || taskDescription.length <= 10 ?
                            <PrimaryButton disabled type='submit' value='submit'>Create</PrimaryButton>
                            :
                            <PrimaryButton type='submit' value='submit'>Create</PrimaryButton>
                        }
                    </Form>
                </div>
            </Modal>

            <Modal
                titleAriaId={titleId}
                isOpen={modalAssignDevIsOpen}
                onDismiss={setModalDevsState}
                isBlocking={false}
                containerClassName={contentStyles.container}
                dragOptions={false}
            >
                <div className={contentStyles.header}>
                    <span id={titleId}>Assign Developer</span>
                    <IconButton
                        styles={iconButtonStyles}
                        iconProps={cancelIcon}
                        ariaLabel="Close popup modal"
                        onClick={setModalDevsState}>
                    </IconButton>
                </div>
                <div className={contentStyles.body}>
                    <Form onSubmit={handleAssignDev}>
                        <FormGroup>
                            <Dropdown
                                selectedKey={selectedDev ? selectedDev.key : undefined}
                                onChange={handleSelectedDevChange}
                                placeholder="Select a Dev"
                                options={optionsDevs}
                                styles={dropdownStyles}
                            />
                        </FormGroup>
                        <PrimaryButton type='submit' value='submit'>Assign Dev</PrimaryButton>
                    </Form>
                </div>
            </Modal>
        </>
    );
}

export default ProjectDetails;
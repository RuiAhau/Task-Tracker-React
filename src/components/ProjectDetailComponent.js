import React, { useState } from 'react';
import { FormGroup, Form } from 'reactstrap';
import { Link } from "react-router-dom";
import { DefaultButton, PrimaryButton, CompoundButton, IconButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { getTheme, mergeStyleSets, FontWeights, Modal, MessageBar, MessageBarType, Icon } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';

import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { DetailsList, SelectionMode } from '@fluentui/react/lib/DetailsList';

function RenderProjectDetails({ project }) {

    const controlStyles = {
        root: {
            margin: '0 30px 20px 0',
            maxWidth: '300px',
        },
    };

    const columns = [
        {
            key: 'column1',
            name: 'Name',
            fieldName: 'taskName',
            minWidth: 150,
            maxWidth: 350,
            isRowHeader: true,
            isResizable: true,
            isSorted: true,
            isSortedDescending: false,
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel: 'Sorted Z to A',
            data: 'string',
            isPadded: true,
        },
        {
            key: 'column2',
            name: 'Status',
            fieldName: 'status',
            minWidth: 150,
            maxWidth: 350,
            isRowHeader: true,
            isResizable: true,
            isSorted: true,
            isSortedDescending: false,
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel: 'Sorted Z to A',
            data: 'string',
            isPadded: true,
        },
        {
            key: 'column3',
            name: 'Assigned To',
            fieldName: 'dev',
            minWidth: 150,
            maxWidth: 350,
            isRowHeader: true,
            isResizable: true,
            isSorted: true,
            isSortedDescending: false,
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel: 'Sorted Z to A',
            data: 'string',
            onRender: (item) => {
                if (!(item.dev.length === 0))
                    return <span>{item.dev[0].firstname} {item.dev[0].lastname} {item.dev[0].role}</span>;
                else
                    return <span></span>;
            },
            isPadded: true,
        },
        {
            key: 'column4',
            name: 'Comments',
            fieldName: 'comments',
            minWidth: 150,
            maxWidth: 350,
            isRowHeader: true,
            isResizable: true,
            isSorted: true,
            isSortedDescending: false,
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel: 'Sorted Z to A',
            data: 'number',
            onRender: (item) => {
                return <span>{item.comments.length}</span>;
            },
            isPadded: true,
        },
        {
            key: 'column5',
            name: 'Taks Details Page',
            fieldName: '_id',
            minWidth: 150,
            maxWidth: 350,
            isRowHeader: true,
            isResizable: true,
            isSorted: true,
            isSortedDescending: false,
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel: 'Sorted Z to A',
            data: 'string',
            onRender: (item) => {
                return <Link to={`/projects/${project._id}/tasks/${item._id}`}><span>Link</span></Link>;
            },
            isPadded: true,
        }
    ]

    const tasks = project.tasks.map((task) => {
        return (
            <Link to={`/projects/${project._id}/tasks/${task._id}`}>
                <CompoundButton className='col' secondaryText={`${task.status}`}>{task.taskName}</CompoundButton>
            </Link>
        );
    });

    const [filter, setFilter] = useState('')
    const onChangeFilter = (event) => {
        setFilter(event.target.value)
    }

    return (
        <div className='container'>
            <div className="row">
                <h3 className="col">Tasks</h3>
            </div>
            <hr />
            <div className="row">
                <div className="col">

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
            </div>
            <hr />
            <div className="creator-row">

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
        if (taskName === '') {
            alert('Task name cannot be empty!')
        } else {
            setModalState(!modalTaskIsOpen)
            props.postTask(taskName, selectedStatus, props.project._id);
            event.preventDefault();
        }
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

    const dropdownStyles = { dropdown: { width: 300 } };

    const dropdownTaskOptions = [
        { key: 'waiting', text: 'Waiting' },
        { key: 'implementation', text: 'Implementation' },
        { key: 'verifying', text: 'Verifying' },
        { key: 'releasing', text: 'Releasing' }
    ];

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

    const iconButtonStyles = {
        root: {
            color: theme.palette.neutralPrimary,
            marginLeft: 'auto',
            marginTop: '4px',
            marginRight: '2px',
        },
        rootHovered: {
            color: theme.palette.neutralDark,
        },
    };

    return (
        <>
            {props.project ?
                <div className="container ">
                    <h3>Project Details of {props.project.projectName}</h3>
                    <div className='row'>
                        <h5>Creator of the Project: {props.project.creator.firstname} - {props.project.creator.role}</h5>
                    </div>
                    <div className='row'>
                        <h5>Description: </h5>
                    </div>
                    <div className='row'>
                        <p>{props.project.description}</p>
                    </div>
                    <RenderProjectDetails project={props.project} />
                </div>
                :
                <div>
                    Not Loaded!
                </div>}

            <div className='container'>
                <div className='row'>
                    <hr />
                    <div className='col-6'><DefaultButton onClick={setModalDevsState}>Assign Developer</DefaultButton></div>
                    <div className='col-6'><DefaultButton onClick={setModalTaskState}>Create Task</DefaultButton></div>
                </div>
            </div>

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
                    <span className="fa fa-times" onClick={setModalTaskState}></span>
                </div>
                <div className={contentStyles.body}>
                    <Form onSubmit={handleCreateTask}>
                        <FormGroup>
                            <TextField label='Task Name'
                                required
                                onChange={handleInputTaskNameChange}
                                value={taskName} />
                            {taskName === '' ?
                                <MessageBar
                                    messageBarType={MessageBarType.info}
                                    isMultiline={false}
                                    dismissButtonAriaLabel="Close"
                                >
                                    Task needs a name!
                                </MessageBar>
                                :
                                <>
                                </>
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
                        <PrimaryButton type='submit' value='submit'>Create</PrimaryButton>
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
                    <span id={titleId}>Assign Developer</span>~
                    <span className="fa fa-times" onClick={setModalTaskState}></span>
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
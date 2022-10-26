import React, { useState } from 'react';
import { FormGroup, Form } from 'reactstrap';
import { Link } from "react-router-dom";
import { DefaultButton, PrimaryButton, CompoundButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { getTheme, mergeStyleSets, FontWeights, Modal } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';

import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { getFocusStyle } from '@fluentui/react/lib/Styling';

import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { List } from '@fluentui/react/lib/List';
import { useConst } from '@fluentui/react-hooks';
import { DetailsList } from '@fluentui/react';

const ListBasic = ({ onRenderCell, devs }) => {
    const originalItems = useConst(() => devs);
    const [items, setItems] = useState(originalItems);

    const resultCountText =
        items.length === originalItems.length ? '' : ` (${items.length} of ${originalItems.length} shown)`;

    const onFilterChanged = (_, text) => {
        setItems(originalItems.filter(item => item.firstname.toLowerCase().indexOf(text.toLowerCase()) >= 0));
    };


    //TODO fix filter change


    return (
        <FocusZone direction={FocusZoneDirection.vertical}>
            <TextField
                label={'Filter by First Name' + resultCountText}
                onChange={onFilterChanged}
            />
            <List items={devs} onRenderCell={onRenderCell} />
        </FocusZone>
    );
};

function RenderProjectDetails({ project }) {

    const theme = getTheme();
    const { palette, semanticColors, fonts } = theme;

    const classNames = mergeStyleSets({
        itemCell: [
            getFocusStyle(theme, { inset: -1 }),
            {
                minHeight: 54,
                padding: 10,
                boxSizing: 'border-box',
                borderBottom: `1px solid ${semanticColors.bodyDivider}`,
                display: 'flex',
                selectors: {
                    '&:hover': { background: palette.neutralLight },
                },
            },
        ],
        itemImage: {
            flexShrink: 0,
        },
        itemContent: {
            marginLeft: 10,
            overflow: 'hidden',
            flexGrow: 1,
        },
        itemName: [
            fonts.xSmall,
            {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            },
        ],
        itemIndex: {
            fontSize: fonts.small.fontSize,
            color: palette.neutralTertiary,
            marginBottom: 10,
        },
        chevron: {
            alignSelf: 'center',
            marginLeft: 10,
            color: palette.neutralTertiary,
            fontSize: fonts.large.fontSize,
            flexShrink: 0,
        },
    });

    const onRenderCell = (item, index) => {
        return (
            <div className={classNames.itemCell} data-is-focusable={true}>
                <div className={classNames.itemContent}>
                    <div className={classNames.itemName}>{item.firstname} {item.lastname} - {item.role}</div>
                </div>
            </div>
        );
    };

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
            <hr />
            <div className="row">
                <div className="col-6">
                    <ListBasic onRenderCell={onRenderCell} devs={project.devs} />
                </div>
                <div className="col-6">
                    <DetailsList 
                    items={project.tasks}/>
                    {tasks}
                </div>
            </div>
            <hr />
            <div className="creator-row">
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
                </div>
                <div className={contentStyles.body}>
                    <Form onSubmit={handleCreateTask}>
                        <FormGroup>
                            <TextField label='Task Name' onChange={handleInputTaskNameChange} value={taskName} />
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
                    <span id={titleId}>Assign Developer</span>
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
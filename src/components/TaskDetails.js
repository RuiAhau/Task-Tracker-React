import React, { useState } from 'react';
import { CardText, CardTitle, Form, FormGroup, Card } from 'reactstrap';

import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField';
import { getTheme, mergeStyleSets, FontWeights, Modal } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';

import { contentStyles, cancelIcon, iconButtonStyles } from './ModalStyles';

function RenderTaskDetails({ project, task, putComment, deleteComment, auth }) {

    const [editCommentIsOpen, setEditCommentModal] = useState(false);

    const setEditCommentModalOpenClose = (event) => {
        setCommentId(event.target.value)
        setEditCommentModal(!editCommentIsOpen);
    }

    var [editComment, setEditComment] = useState('');

    const handleEditCommentInput = (event) => {
        setEditComment(event.target.value)
    }

    var [commentId, setCommentId] = useState('');

    const handleEditComment = (event) => {
        setEditCommentModal(!editCommentIsOpen)
        putComment(project._id, task._id, commentId, editComment)
        event.preventDefault();
    }

    const handleDeleteComment = (event) => {
        deleteComment(project._id, task._id, event.target.value)
        event.preventDefault();
    }

    const comments = task.comments.map((comment) => {
        return (
            <>
                <Card>
                    <h5 className='mt-2'>Author: {comment.author.firstname} -- {comment.author.role}</h5>
                    <CardText>
                        <div>
                            <p className='col-6 float-left ml-3'>{comment.comment}</p>
                            {auth.user.username === comment.author.username ?
                                <>
                                    <PrimaryButton className='col-2' text='Edit' onClick={setEditCommentModalOpenClose} value={comment._id}></PrimaryButton>
                                    <PrimaryButton className='col-2 ml-2' text='Delete' onClick={handleDeleteComment} value={comment._id}></PrimaryButton>
                                </>
                                :
                                <>
                                    <PrimaryButton disabled className='col-2' text='Edit' onClick={setEditCommentModalOpenClose} value={comment._id}></PrimaryButton>
                                    <PrimaryButton disabled className='col-2 ml-2' text='Delete' onClick={handleDeleteComment} value={comment._id}></PrimaryButton>
                                </>}
                        </div>
                    </CardText>
                </Card>
            </>
        );
    })

    const devs = task.dev.map((dev) => {
        return (
            <Card>
                <CardTitle>{dev.firstname} {dev.lastname} -- {dev.role}</CardTitle>
            </Card>
        );
    })

    const titleId = useId('title');

    return (
        <>
            <div className='container'>
                <div className='row'>
                    <h3 className='col-6'>Dev</h3>
                    <h3 className='col-6'>Comments</h3>
                </div>
                <div className='row'>
                    <div className='col-6'>{devs}</div>
                    <div className='col-6'>{comments}</div>
                </div>
            </div>

            <Modal
                titleAriaId={titleId}
                isOpen={editCommentIsOpen}
                onDismiss={setEditCommentModalOpenClose}
                isBlocking={false}
                containerClassName={contentStyles.container}
                dragOptions={false}
            >
                <div className={contentStyles.header}>
                    <span id={titleId}>Edit Comment</span>
                </div>
                <div className={contentStyles.body}>
                    <Form onSubmit={handleEditComment}>
                        <FormGroup>
                            <TextField label="Comment" multiline autoAdjustHeight onChange={handleEditCommentInput} value={editComment} />
                        </FormGroup>
                        <PrimaryButton type='submit' value='submit'>Edit</PrimaryButton>
                    </Form>
                </div>
            </Modal>
        </>
    );
}

const TaskDetails = (props) => {

    var project = props.projects.projects.filter((project) => project._id === props.match.params.projectId)[0];
    if (!project) {

    } else {
        var task = project.tasks.filter((task) => task._id === props.match.params.taskId)[0];
    }

    const [commentModalIsOpen, setCommentModalState] = useState(false);

    const setCommentModalOpenClose = () => {
        setCommentModalState(!commentModalIsOpen)
    }

    const [devModalIsOpen, setDevModalState] = useState(false);

    const setDevModalOpenClose = () => {
        setDevModalState(!devModalIsOpen)
    }

    const [comment, setComment] = useState('');

    const handleInputComment = event => {
        setComment(event.target.value);
    }

    const [newStatus, setNewStatus] = useState();

    const handleStatusInput = (event, item) => {
        setNewStatus(item.key);
        props.putStatus(item.key, project._id, task._id)
    }

    const [selectedDev, setSelectedDev] = useState();

    const handleSelectedDevChange = (event, item) => {
        setSelectedDev(item.key);
    }

    const handlePostComment = (event) => {
        setCommentModalState(!commentModalIsOpen)
        props.postComment(comment, project._id, task._id);
        event.preventDefault();
    }

    const handlePostDev = (event) => {
        setDevModalState(!devModalIsOpen)
        props.postDevInTask(selectedDev, project._id, task._id);
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

    const titleId = useId('title');

    return (
        <>
            {project && task ?
                <div className='container'>
                    <h3>Task Details of {task.taskName}</h3>
                    <h2>Status: {newStatus === undefined ? task.status : newStatus}</h2>
                    <div className='align-dropdown-center'>
                        <Dropdown
                            selectedKey={newStatus ? newStatus.key : undefined}
                            onChange={handleStatusInput}
                            placeholder="Select new status"
                            options={dropdownTaskOptions}
                            styles={dropdownStyles}
                        />
                    </div>
                    <RenderTaskDetails auth={props.auth} project={project} task={task} putComment={props.putComment} deleteComment={props.deleteComment} />
                </div>
                :
                <div>Not Loaded</div>
            }

            <div className='container'>
                <hr />
                <div className='row'>
                    <div className='col-6'><DefaultButton onClick={setDevModalOpenClose}>Assign Dev</DefaultButton></div>
                    <div className='col-6'><DefaultButton onClick={setCommentModalOpenClose}>Add Comment</DefaultButton></div>
                </div>
            </div>

            <Modal
                titleAriaId={titleId}
                isOpen={commentModalIsOpen}
                onDismiss={setCommentModalOpenClose}
                isBlocking={false}
                containerClassName={contentStyles.container}
                dragOptions={false}
            >
                <div className={contentStyles.header}>
                    <span id={titleId}>Add Comment</span>
                </div>
                <div className={contentStyles.body}>
                    <Form onSubmit={handlePostComment}>
                        <FormGroup>
                            <TextField label="Comment" multiline autoAdjustHeight onChange={handleInputComment} value={comment} />
                        </FormGroup>
                        <PrimaryButton type='submit' value='submit'>Create</PrimaryButton>
                    </Form>
                </div>
            </Modal>

            <Modal
                titleAriaId={titleId}
                isOpen={devModalIsOpen}
                onDismiss={setDevModalOpenClose}
                isBlocking={false}
                containerClassName={contentStyles.container}
                dragOptions={false}
            >
                <div className={contentStyles.header}>
                    <span id={titleId}>Add Comment</span>
                </div>
                <div className={contentStyles.body}>
                    <Form onSubmit={handlePostDev}>
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
                        <PrimaryButton type='submit' value='submit'>Add Dev</PrimaryButton>
                    </Form>
                </div>
            </Modal>
        </>
    );
}

export default TaskDetails;
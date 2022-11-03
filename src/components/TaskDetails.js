import React, { useState } from 'react';
import { Form, FormGroup } from 'reactstrap';
import { DefaultButton, PrimaryButton, IconButton } from '@fluentui/react/lib/Button';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField';
import { Modal } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { contentStyles, cancelIcon, iconButtonStyles } from './ModalStyles';

import { ProgressIndicator } from '@fluentui/react/lib/ProgressIndicator';
import { Icon } from '@fluentui/react/lib/Icon';

function RenderTaskDetails({ project, task, putComment, deleteComment, auth }) {

    const [editCommentIsOpen, setEditCommentModal] = useState(false);

    const setEditCommentModalOpenClose = (event, comment) => {
        setEditComment(comment)
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
                <div className='row mt-2'>
                    <h5 className=''>{comment.author.firstname} {comment.author.lastname}</h5>

                </div>
                <div className='container col-12'>
                    <p className='col task-comments'>{comment.comment}</p>
                    <p className='col task-created'>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', second: '2-digit' }).format(new Date(Date.parse(comment.updatedAt)))}</p>
                    <div className='row'>
                        {auth.user.username === comment.author.username ?
                            <>
                                <PrimaryButton onClick={(e) => setEditCommentModalOpenClose(e, comment.comment)} value={comment._id}><Icon className='mr-1' iconName='Edit' />Edit</PrimaryButton>
                                <PrimaryButton className='ml-4' onClick={handleDeleteComment} value={comment._id}><Icon className='mr-1' iconName='Delete' />Delete</PrimaryButton>
                            </>
                            :
                            <>
                            </>
                        }
                    </div>
                </div>
            </>
        );
    })

    const titleId = useId('title');

    return (
        <>
            <div className='container'>
                <div className='col-3'>
                    <h3>Comments</h3>
                </div>
                <div className='col'>
                    <div>{comments}</div>
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
                    <IconButton
                        styles={iconButtonStyles}
                        iconProps={cancelIcon}
                        ariaLabel="Close popup modal"
                        onClick={setEditCommentModalOpenClose}>
                    </IconButton>
                </div>
                <div className={contentStyles.body}>
                    <Form onSubmit={handleEditComment}>
                        <FormGroup>
                            <TextField label="Comment" multiline autoAdjustHeight onChange={handleEditCommentInput} value={editComment} />
                        </FormGroup>
                        <PrimaryButton type='submit' value='submit'><Icon className='mt-1 mr-1' iconName='Save' />Save</PrimaryButton>
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

    const [devModalIsOpen, setDevModalState] = useState(false);

    const setDevModalOpenClose = () => {
        setDevModalState(!devModalIsOpen)
    }

    const [comment, setComment] = useState('');

    const handleInputComment = event => {
        setComment(event.target.value);
    }

    const [commentArea, setCommentArea] = useState(false);

    const setCommentAreaOpenClose = event => {
        setCommentArea(!commentArea);
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
        if (comment === '') {
            alert('Comment cannot be empty!')
        } else {
            setCommentAreaOpenClose(!commentArea)
            props.postComment(comment, project._id, task._id);
            event.preventDefault();
        }
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
                    <hr />
                    <ProgressIndicator className='mb-4' label="Task Progress" percentComplete={parseFloat(task.progress.$numberDecimal)} />
                    <div className='row'>
                        <h2 className='ml-4'>Status: {newStatus === undefined ? task.status : newStatus}</h2>
                        <div className='align-dropdown-center'>
                            <Dropdown className='mt-2 ml-4'
                                selectedKey={newStatus ? newStatus.key : undefined}
                                onChange={handleStatusInput}
                                placeholder="Select new status"
                                options={dropdownTaskOptions}
                                styles={dropdownStyles}
                            />
                        </div>
                        <h2 className='assignee-row col'>Assignee: </h2>
                        <h4 className='mt-2 mr-4'>{task.dev[0]?.firstname} {task.dev[0]?.lastname}</h4>
                    </div>
                    <div className='col mt-3'>
                        <div className='row'><h5 className='ml-2'>Description</h5></div>
                        <p className='project-description ml-10'>{task.description}</p>
                    </div>
                    <hr />
                    <RenderTaskDetails auth={props.auth} project={project} task={task} putComment={props.putComment} deleteComment={props.deleteComment} />
                </div>
                :
                <div>Not Loaded</div>
            }

            <div className='container'>
                <hr />
                {commentArea ?
                    <>
                        <TextField label="Comment" multiline autoAdjustHeight onChange={handleInputComment} value={comment} />
                        <div className='col comment-options mt-2 mb-2'>
                            {comment.length <= 10 ?
                                <>
                                    <PrimaryButton disabled onClick={handlePostComment}>Confirm</PrimaryButton>
                                    <DefaultButton className='ml-4' onClick={setCommentAreaOpenClose}>Cancel</DefaultButton>
                                </>
                                :
                                <>
                                    <PrimaryButton onClick={handlePostComment}>Confirm</PrimaryButton>
                                    <DefaultButton className='ml-4' onClick={setCommentAreaOpenClose}>Cancel</DefaultButton>
                                </>
                            }
                        </div>
                    </>
                    :
                    <div></div>
                }
                <div className='row'>
                    {props.auth.userInfo?.role === 'manager' ?
                        <>
                            <div className='col-6'><DefaultButton onClick={setDevModalOpenClose}><Icon className='mr-1' iconName='Assign' />Assign Dev</DefaultButton></div>
                            <div className='col-6'><DefaultButton onClick={setCommentAreaOpenClose}><Icon className='mr-1 mt-1' iconName='Comment' />Add Comment</DefaultButton></div>
                        </>
                        :
                        <div className='col'><DefaultButton onClick={setCommentAreaOpenClose}>Add Comment</DefaultButton></div>
                    }
                </div>
            </div>

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
                    <IconButton
                        styles={iconButtonStyles}
                        iconProps={cancelIcon}
                        ariaLabel="Close popup modal"
                        onClick={setDevModalOpenClose}>
                    </IconButton>
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
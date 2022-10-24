import React, { useState } from 'react';
import { CardText, CardTitle, Modal, ModalHeader, ModalBody, Input, Label, Button, Form, FormGroup, Card } from 'reactstrap';

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
                    <CardTitle><p className='mt-2'>Author: {comment.author.firstname} -- {comment.author.role}</p></CardTitle>
                    <CardText>
                        <div>
                            <p className='col-6 float-left ml-3'>{comment.comment}</p>
                            {auth.user.username === comment.author.username ?
                                <>
                                    <Button outline className='col-2' onClick={setEditCommentModalOpenClose} value={comment._id}>Edit</Button>
                                    <Button outline className='col-2 ml-2' onClick={handleDeleteComment} value={comment._id}>Delete</Button>
                                </>
                                :
                                <div></div>}
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

            <Modal isOpen={editCommentIsOpen} toggle={setEditCommentModalOpenClose}>
                <ModalHeader toggle={setEditCommentModalOpenClose}>Edit Comment</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleEditComment}>
                        <FormGroup>
                            <Label htmlFor='editcomment'>Comment</Label>
                            <Input type='text' id='editcomment' name='editcomment'
                                onChange={handleEditCommentInput} value={editComment} />
                        </FormGroup>
                        <Button type='submit' value='submit'>Edit</Button>
                    </Form>
                </ModalBody>
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

    const [statusModalIsOpen, setStatusModalState] = useState(false);

    const setStatusModalOpenClose = () => {
        setStatusModalState(!statusModalIsOpen)
    }

    const [devModalIsOpen, setDevModalState] = useState(false);

    const setDevModalOpenClose = () => {
        setDevModalState(!devModalIsOpen)
    }

    var [comment, setComment] = useState('');

    const handleInputComment = event => {
        setComment(event.target.value);
    }

    var [newStatus, setNewStatus] = useState('');

    const handleStatusInput = event => {
        setNewStatus(event.target.value);
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

    const handlePutStatus = (event) => {
        setStatusModalState(!statusModalIsOpen)
        props.putStatus(newStatus, project._id, task._id);
        event.preventDefault();
    }

    const [selectedDev, setSelectedDev] = useState('');

    const optionsDevs = props.users.users.map((dev) => {
        return (
            <option value={dev._id}>
                {dev.firstname} {dev.lastname} -- {dev.role}
            </option>
        );
    })

    return (
        <>
            {props.projects && task ?
                <div className='container'>
                    <h3>Task Details of {task.taskName}</h3>
                    <h2>Status: {task.status} <Button outline onClick={setStatusModalOpenClose}>Edit</Button></h2>
                    <RenderTaskDetails auth={props.auth} project={project} task={task} putComment={props.putComment} deleteComment={props.deleteComment} />
                </div>
                :
                <div>Not Loaded</div>
            }
            <hr />
            <div className='row'>
                <div className='col-6'><Button onClick={setDevModalOpenClose}>Assign Dev</Button></div>
                <div className='col-6'><Button onClick={setCommentModalOpenClose}>Add Comment</Button></div>
            </div>

            <Modal isOpen={commentModalIsOpen} toggle={setCommentModalOpenClose}>
                <ModalHeader toggle={setCommentModalOpenClose}>Add Comment</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handlePostComment}>
                        <FormGroup>
                            <Label htmlFor='comment'>Comment</Label>
                            <Input type='text' id='comment' name='comment'
                                onChange={handleInputComment} value={comment} />
                        </FormGroup>
                        <Button type='submit' value='submit'>Create</Button>
                    </Form>
                </ModalBody>
            </Modal>

            <Modal isOpen={statusModalIsOpen} toggle={setStatusModalOpenClose}>
                <ModalHeader toggle={setStatusModalOpenClose}>Change Status</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handlePutStatus}>
                        <FormGroup>
                            <Label htmlFor='newStatus'>New Task Status</Label>
                            <select onChange={(e) => setNewStatus(e.target.value)}
                                value={newStatus}>
                                <option value='waiting'>Waiting</option>
                                <option value='implementation'>Implementation</option>
                                <option value='verifying'>Verifying</option>
                                <option value='releasing'>Releasing</option>
                            </select>
                        </FormGroup>
                        <Button type='submit' value='submit'>Change</Button>
                    </Form>
                </ModalBody>
            </Modal>

            <Modal isOpen={devModalIsOpen} toggle={setDevModalOpenClose}>
                <ModalHeader toggle={setDevModalOpenClose}>Add Developer</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handlePostDev}>
                        <FormGroup>
                            <Label htmlFor='devs'>Devs </Label>
                            <select onChange={(e) => setSelectedDev(e.target.value)}
                                value={selectedDev}>
                                {optionsDevs}
                            </select>
                        </FormGroup>
                        <Button type='submit' value='submit'>Add Dev</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    );
}

export default TaskDetails;
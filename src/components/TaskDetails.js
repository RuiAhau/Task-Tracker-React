import React, { useState } from 'react';
import { CardText, CardTitle, Modal, ModalHeader, ModalBody, Input, Label, Button, Form, FormGroup, Card } from 'reactstrap';
import { putComment } from '../redux/ActionCreators';

function RenderTaskDetails({ project, task, putComment, auth }) {


    const [editCommentIsOpen, setEditCommentModal] = useState(false);

    const setEditCommentModalOpenClose = () => {
        setEditCommentModal(!editCommentIsOpen)
    }

    var [editComment, setEditComment] = useState('');

    const handleEditCommentInput = event => {
        setEditComment(event.target.value)
    }

    const comments = task.comments.map((comment) => {
        const handlePutComment = (event) => {
            if (comment.author.username === auth.user.username) {
                setEditCommentModal(!editCommentIsOpen)
                console.log('Comment a ser editado: ', comment._id)
                putComment(project._id, task._id, comment._id, editComment);
                event.preventDefault();
            }
        }

        return (
            <>
                <Card>
                    <CardTitle><p className='mt-2'>Author: {comment.author.firstname} -- {comment.author.role}</p></CardTitle>
                    <CardText>
                        <div>
                            <p className='col-6 float-left ml-3'>{comment.comment}</p>
                            <Button outline className='col-2' onClick={setEditCommentModalOpenClose}>Edit</Button>
                            <Button outline className='col-2 ml-2'>Delete</Button>
                        </div>
                    </CardText>
                </Card>

                <Modal isOpen={editCommentIsOpen} toggle={setEditCommentModalOpenClose}>
                    <ModalHeader toggle={setEditCommentModalOpenClose}>Edit Comment</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={handlePutComment}>
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
    })

    const devs = task.dev.map((dev) => {
        return (
            <Card>
                <CardTitle>{dev.firstname} {dev.lastname} -- {dev.role}</CardTitle>
            </Card>
        );
    })
    return (
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
                    <RenderTaskDetails auth={props.auth} project={project} task={task} putComment={props.putComment} />
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
                            <Input type='text' id='newStatus' name='newStatus'
                                onChange={handleStatusInput} value={newStatus} />
                        </FormGroup>
                        <Button type='submit' value='submit'>Change</Button>
                    </Form>
                </ModalBody>
            </Modal>

            <Modal isOpen={devModalIsOpen} toggle={setDevModalOpenClose}>
                <ModalHeader toggle={setDevModalOpenClose}>Change Status</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handlePostDev}>
                        <FormGroup>
                            <Label htmlFor='devs'>Devs </Label>
                            <select onChange={(e) => setSelectedDev(e.target.value)}
                                value={selectedDev}>
                                {optionsDevs}
                            </select>
                        </FormGroup>
                        <Button type='submit' value='submit'>Change</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    );
}

export default TaskDetails;
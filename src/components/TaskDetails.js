import React, { useState } from 'react';
import { Card, CardTitle, Modal, ModalHeader, ModalBody, Input, Label, Button, Form, FormGroup } from 'reactstrap';

function RenderTaskDetails({ task }) {
    const comments = task.comments.map((comment) => {
        return (
            <ul className='list unstyled mt-3'>
                <p>Author: {comment.author.firstname}</p>
                <p>{comment.comment}</p>                
            </ul>
        );
    })

    const devs = task.dev.map((dev) => {
        return (
            <ul className='list unstyled mt-3'>
                <p>{dev.firstname} {dev.lastname}</p>
                <hr />
            </ul>
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
    var task = project.tasks.filter((task) => task._id === props.match.params.taskId)[0];

    const [modalIsOpen, setModalState] = useState(false);

    const setModalOpenClose = () => {
        setModalState(!modalIsOpen)
    }

    const handlePostComment = (event) => {
        setModalState(!modalIsOpen)
        props.postComment(comment, project._id, task._id);
        event.preventDefault();
    }

    var [comment, setComment] = useState('');

    const handleInputComment = event => {
        setComment(event.target.value);
    }

    return (
        <>
            <div className='container'>
                <h3>Task Details of {task.taskName}</h3>
                <h2>Status: {task.status}</h2>
                <RenderTaskDetails task={task} />
                <hr />
                <div className='row'>
                    <div className='col-6'></div>
                    <div className='col-6'><Button onClick={setModalOpenClose}>Add Comment</Button></div>
                </div>
            </div>

            <Modal isOpen={modalIsOpen} toggle={setModalOpenClose}>
                <ModalHeader toggle={setModalOpenClose}>Add Comment</ModalHeader>
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
        </>
    );
}

export default TaskDetails;
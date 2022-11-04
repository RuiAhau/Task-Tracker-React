import React, { Component } from 'react';
import { Navbar, NavItem, Form, FormGroup, Input, Nav } from 'reactstrap';
import { DefaultButton, PrimaryButton, IconButton } from '@fluentui/react/lib/Button';
import { Label } from '@fluentui/react/lib/Label';
import Nave from './NavItemComponent';
import { Modal } from '@fluentui/react';
import { contentStyles, cancelIcon, iconButtonStyles } from './ModalStyles';
import { Icon } from '@fluentui/react/lib/Icon';

import { TextField } from '@fluentui/react/lib/TextField';

class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            firstname: '',
            lastname: '',
            username: '',
            password: '',
            isLoginModalOpen: false,
            isSignUpModalOpen: false,
            titleId: 'title'
        }

        this.handleFirstnameChange = this.handleFirstnameChange.bind(this);
        this.handleLastnameChange = this.handleLastnameChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.toggleSignUpModal = this.toggleSignUpModal.bind(this);
    }

    toggleModal() {
        this.setState({
            isLoginModalOpen: !this.state.isLoginModalOpen
        })
    }

    toggleSignUpModal() {
        this.setState({
            isSignUpModalOpen: !this.state.isSignUpModalOpen
        })
    }

    handleFirstnameChange(event) {
        this.setState({
            firstname: event.target.value
        })
    }

    handleLastnameChange(event) {
        this.setState({
            lastname: event.target.value
        })
    }

    handleUsernameChange(event) {
        this.setState({
            username: event.target.value
        })
    }

    handlePasswordChange(event) {
        this.setState({
            password: event.target.value
        })
    }

    handleLogin(event) {
        this.toggleModal();
        this.props.loginUser({ username: this.state.username, password: this.state.password })
        event.preventDefault();
    }

    handleLogout() {
        this.props.logoutUser();
    }

    handleSignUp(event) {
        this.toggleSignUpModal();
        this.props.signUpUser({ username: this.state.username, password: this.state.password, firstname: this.state.firstname, lastname: this.state.lastname })
        event.preventDefault();
    }

    render() {
        return (
            <>
                <Navbar className='mb-5' style={{ "backgroundColor": "#3498DB" }}>
                    <Nav navbar>
                        <NavItem>
                            <Nave />
                        </NavItem>
                    </Nav>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            {!this.props.auth.isAuthenticated ?
                                <>
                                    <PrimaryButton className='ml-4' onClick={this.toggleModal}><Icon className='mr-1 mt-1' iconName='Signin' />Login</PrimaryButton>
                                    <PrimaryButton className='ml-4' onClick={this.toggleSignUpModal}><Icon className='mr-1 mt-1' iconName='UserFollowed' />Sign Up</PrimaryButton>
                                </>
                                :
                                <div>
                                    <div className="navbar-text mr-2"> Hello, {this.props.auth.userInfo.firstname} {this.props.auth.userInfo.lastname}!</div>
                                    <DefaultButton onClick={this.handleLogout}><Icon className='mr-1 mt-1' iconName='SignOut' />Logout</DefaultButton>
                                </div>
                            }
                        </NavItem>
                    </Nav>
                </Navbar>

                <Modal
                    titleAriaId={this.state.titleId}
                    isOpen={this.state.isLoginModalOpen}
                    onDismiss={this.toggleModal}
                    isBlocking={false}
                    containerClassName={contentStyles.container}
                    dragOptions={false}
                >
                    <div className={contentStyles.header}>
                        <span id={this.state.titleId}>Login</span>
                        <IconButton
                            styles={iconButtonStyles}
                            iconProps={cancelIcon}
                            ariaLabel="Close popup modal"
                            onClick={this.toggleModal}>
                        </IconButton>
                    </div>
                    <div className={contentStyles.body}>
                        <Form onSubmit={this.handleLogin}>
                            <FormGroup>
                                <TextField label='Username'
                                    required
                                    onChange={(e) => this.handleUsernameChange(e)}
                                    value={this.state.username}
                                    validateOnLoad={false}
                                    validateOnFocusOut={true}
                                    onGetErrorMessage={value => {
                                        if (!(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value))) {
                                            return 'Not a valid email!'
                                        }
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <TextField label='Password'
                                    type="password"
                                    canRevealPassword
                                    required
                                    onChange={(e) => this.handlePasswordChange(e)}
                                    value={this.state.password}
                                    validateOnLoad={false}
                                    validateOnFocusOut={true}
                                    onGetErrorMessage={value => {
                                        if (value.length <= 5)
                                            return 'Password must have more than 5 characters!'
                                    }} />
                            </FormGroup>
                            {/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.username) ?
                                <PrimaryButton type="submit" value="submit" color="primary">Login</PrimaryButton>
                                :
                                <PrimaryButton disabled type="submit" value="submit" color="primary">Login</PrimaryButton>
                            }

                        </Form>
                    </div>
                </Modal>

                <Modal
                    titleAriaId={this.state.titleId}
                    isOpen={this.state.isSignUpModalOpen}
                    onDismiss={this.toggleSignUpModal}
                    isBlocking={false}
                    containerClassName={contentStyles.container}
                    dragOptions={false}
                >
                    <div className={contentStyles.header}>
                        <span id={this.state.titleId}>Register</span>
                        <IconButton
                            styles={iconButtonStyles}
                            iconProps={cancelIcon}
                            ariaLabel="Close popup modal"
                            onClick={this.toggleSignUpModal}>
                        </IconButton>
                    </div>
                    <div className={contentStyles.body}>
                        <Form onSubmit={this.handleSignUp}>
                            <FormGroup>
                                <TextField label='First Name'
                                    required
                                    onChange={(e) => this.handleFirstnameChange(e)}
                                    value={this.state.firstname}
                                    validateOnLoad={false}
                                    validateOnFocusOut={true}
                                    onGetErrorMessage={value => {
                                        if (value.length < 3)
                                            return 'First name must have more than 3 characters!'
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <TextField label='Last Name'
                                    required
                                    onChange={(e) => this.handleLastnameChange(e)}
                                    value={this.state.lastname}
                                    validateOnLoad={false}
                                    validateOnFocusOut={true}
                                    onGetErrorMessage={value => {
                                        if (value.length <= 3)
                                            return 'Last name must have more than 3 characters!'
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <TextField label='Username'
                                    required
                                    onChange={(e) => this.handleUsernameChange(e)}
                                    value={this.state.username}
                                    validateOnLoad={false}
                                    validateOnFocusOut={true}
                                    onGetErrorMessage={value => {
                                        if (!(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value))) {
                                            return 'Not a valid email!'
                                        }
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <TextField label='Password'
                                    type="password"
                                    canRevealPassword
                                    required
                                    onChange={(e) => this.handlePasswordChange(e)}
                                    value={this.state.password}
                                    validateOnLoad={false}
                                    validateOnFocusOut={true}
                                    onGetErrorMessage={value => {
                                        if (value.length <= 5)
                                            return 'Password must have more than 5 characters!'
                                    }} />
                            </FormGroup>
                            <PrimaryButton type="submit" value="submit" color="primary">Sign Up</PrimaryButton>
                        </Form>
                    </div>
                </Modal>

            </>
        );
    }
}

export default Header;
import React, { Component } from 'react';
import { Navbar, NavItem, ModalHeader, ModalBody, Form, FormGroup, Input, Nav } from 'reactstrap';
import { DefaultButton, PrimaryButton, IconButton } from '@fluentui/react/lib/Button';
import { Label } from '@fluentui/react/lib/Label';
import Nave from './NavItemComponent';
import { Modal } from '@fluentui/react';
import { contentStyles, cancelIcon, iconButtonStyles } from './ModalStyles';
import { Icon } from '@fluentui/react/lib/Icon';
import { useId } from '@fluentui/react-hooks';

class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoginModalOpen: false,
            isSignUpModalOpen: false,
            titleId: 'title'
        }

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

    handleLogin(event) {
        this.toggleModal();
        this.props.loginUser({ username: this.username.value, password: this.password.value })
        event.preventDefault();
    }

    handleLogout() {
        this.props.logoutUser();
    }

    handleSignUp(event) {
        this.toggleSignUpModal();
        this.props.signUpUser({ username: this.username.value, password: this.password.value, firstname: this.firstname.value, lastname: this.lastname.value })
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
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" name="username"
                                    innerRef={(input) => this.username = input} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password"
                                    innerRef={(input) => this.password = input} />
                            </FormGroup>
                            <PrimaryButton type="submit" value="submit" color="primary">Login</PrimaryButton>
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
                                <Label htmlFor="firstname">First Name</Label>
                                <Input type="text" id="firstname" name="firstname"
                                    innerRef={(input) => this.firstname = input} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="lastname">Last Name</Label>
                                <Input type="text" id="lastname" name="lastname"
                                    innerRef={(input) => this.lastname = input} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" name="username"
                                    innerRef={(input) => this.username = input} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password"
                                    innerRef={(input) => this.password = input} />
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
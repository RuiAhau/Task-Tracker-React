import React, { Component } from 'react';
import { Navbar, NavItem, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Nav } from 'reactstrap';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Label } from '@fluentui/react/lib/Label';
import Nave from './NavItemComponent';

class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
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

    render() {
        return (
            <>
                <Navbar className='mb-5' style={{"backgroundColor": "#3498DB"}}>
                    <Nav navbar>
                        <NavItem>
                            <Nave />
                        </NavItem>
                    </Nav>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            {!this.props.auth.isAuthenticated ?

                                <PrimaryButton className='ml-4' onClick={this.toggleModal}>Login</PrimaryButton>

                                :
                                <div>
                                    <div className="navbar-text mr-2"> Hello, {this.props.auth.userInfo.firstname} {this.props.auth.userInfo.lastname}!</div>
                                    <DefaultButton onClick={this.handleLogout}>Logout</DefaultButton>
                                </div>
                            }
                        </NavItem>
                    </Nav>
                </Navbar>

                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
                    <ModalBody>
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
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

export default Header;
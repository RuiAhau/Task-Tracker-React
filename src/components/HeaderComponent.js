import React, { Component } from 'react';
import { Navbar, NavItem, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Label } from '@fluentui/react/lib/Label';
import { Nav } from '@fluentui/react/lib/Nav';

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

    navStyles = { root: { width: 200 } };

    navLinkGroups = [
        {
            name: 'Task Tracker',
            links: [
                {
                    key: 'Projects',
                    name: 'Projects',
                    url: '/projects',

                },
                {
                    key: 'Users',
                    name: 'Users',
                    url: '/users'
                }
            ],
        },
    ];

    render() {
        return (
            <>
                <Navbar>
                    <Nav
                        styles={this.navStyles}
                        groups={this.navLinkGroups}
                        focusZoneProps={{
                            defaultTabbableElement: "a[title='Projects']",
                            allowFocusRoot: false,
                        }}
                    />
                    {!this.props.auth.isAuthenticated ?
                            <PrimaryButton className='ml-4' onClick={this.toggleModal}>Login</PrimaryButton>
                        :
                        <div>
                            <div className="navbar-text">{this.props.auth.user.username}</div>
                            <DefaultButton onClick={this.handleLogout}> Logout</DefaultButton>
                        </div>
                    }
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
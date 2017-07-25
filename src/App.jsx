import axios from 'axios';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'

import About from './components/About';
import Form from './components/Form';
import Logout from './components/Logout';
import NavBar from './components/NavBar';
import UsersList from './components/UsersList';
import UserStatus from './components/UserStatus';

class App extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            formData: {
                username: '',
                email: '',
                password: ''
            },
            isAuthenticated: false,
            title: 'Users App',
            username: '',
            users: []
        }
    }

    componentDidMount() {
        this.getUsers();
    }

    /**
     * adds new user and update state 
     * @param {*} event 
     */
    addUser(event) {
        event.preventDefault();
        const data = {
            username: this.state.username,
            email: this.state.email
        };
        axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
        .then((res) => {
            this.getUsers();
            this.setState({ username: '', email: '' });
        })
        .catch((err) => { console.log(err); })
    }
    
    /**
     * handles changes in add user form 
     * @param {*} event 
     */
    handleChange(event) {
        const obj = {};
        obj[event.target.name] = event.target.value;
        this.setState(obj);
    }

    handleFormChange(event) {
        const obj = this.state.formData;
        obj[event.target.name] = event.target.value;
        this.setState(obj);
    }

    handleUserFormSubmit(event) {
        event.preventDefault();
        const formType = window.location.href.split('/').reverse()[0];
        let data;
        if (formType === 'login') {
            data = {
                email: this.state.formData.email,
                password: this.state.formData.password
            }
        }
        if (formType === 'register') {
            data = {
                username: this.state.formData.email,
                email: this.state.formData.email,
                password: this.state.formData.password
            }
        }
        const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${formType}`;
        axios.post(url, data)
            .then((res) => {
                this.setState({
                    email: '',
                    formData: {username: '', email: '', password: '' },
                    isAuthenticated: true,
                    username: ''
                });
                window.localStorage.setItem('authToken', res.data.auth_token);
                this.getUsers();
            })
            .catch((err) => { console.log(err); });
    }

    /**
     * gets user's list
     */
    getUsers() {
        axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
        .then((res) => { this.setState({ users: res.data.data.users }); })
        .catch((err) => { console.log(err); });
    }

    logoutUser() {
        window.localStorage.clear();
        this.setState({ isAuthenticated: false });
    }

    render() {
        return (
            <div>
                <NavBar
                    title={this.state.title}
                    isAuthenticated={this.state.isAuthenticated}
                />
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <br/>
                            <Switch>
                                <Route exact path='/' render={() => (
                                    <UsersList
                                        users={this.state.users}
                                    />
                                )} />
                                <Route exact path='/about' component={About}/>
                                <Route exact path='/register' render={() => (
                                    <Form
                                        formType={'Register'}
                                        formData={this.state.formData}
                                        handleFormChange={this.handleFormChange.bind(this)}
                                        handleUserFormSubmit={this.handleUserFormSubmit.bind(this)}
                                        isAuthenticated={this.state.isAuthenticated}
                                    />
                                )} />
                                <Route exact path='/login' render={() => (
                                    <Form
                                        formType={'Login'}
                                        formData={this.state.formData}
                                        handleFormChange={this.handleFormChange.bind(this)}
                                        handleUserFormSubmit={this.handleUserFormSubmit.bind(this)}
                                        isAuthenticated={this.state.isAuthenticated}
                                    />
                                )} />
                                <Route exact path='/logout' render={() => (
                                    <Logout
                                        logoutUser={this.logoutUser.bind(this)}
                                        isAuthenticated={this.state.isAuthenticated}
                                    />
                                )} />
                                <Route exact path='/status' render={() => (
                                    <UserStatus
                                        isAuthenticated={this.state.isAuthenticated}
                                    />
                                )} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default App

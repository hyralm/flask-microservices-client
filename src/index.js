import axios from 'axios';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AddUser from './components/AddUser';
import UsersList from './components/UsersList';

class App extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
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
        }
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

    /**
     * gets user's list
     */
    getUsers() {
        axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
        .then((res) => { this.setState({ users: res.data.data.users }); })
        .catch((err) => { console.log(err); });
    }

    render() {
        return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <br/>
                    <h1>All Users</h1>
                    <hr/><br/>
                    <AddUser
                        username={this.state.username}
                        email={this.state.email}
                        handleChange={this.handleChange.bind(this)}
                        addUser={this.addUser.bind(this)}
                    />
                    <br/>
                    <UsersList users={this.state.users}/>
                </div>
            </div>
        </div>
        )
    }

}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

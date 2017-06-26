import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router';
import getSocket from '../../socket.js';

class OnlinePage extends Component {
    constructor(props) {
        super(props);
        this.getAllOnlineUsers = this.getAllOnlineUsers.bind(this);
        this.state = { };
    }

    componentDidMount() {
        this.getAllOnlineUsers().then(() => {
            let socket = getSocket();
            socket.on('updateOnlineUsers', () => {
                this.getAllOnlineUsers();

            })
        });
    }

    getAllOnlineUsers() {
        return axios.get('/getAllOnlineUsers').then((res) => {
            if (res.data.results.length > 1) {
                this.setState({ onlineUsers: res.data.results })
            }
        })
    }

    render() {
        let onlineResults = "";
        if(!this.state.onlineUsers) {
            return (
                <h3>You're alone</h3>
            )
        } else {
            onlineResults = this.state.onlineUsers.map((item) => {
                if (item.id != this.props.userId) {
                    return (
                        <li className='user-summary'>
                            <Link to={item.userUrl}><img src={item.imageUrl}/></Link>
                            <p key={item.name}>{item.name}</p>
                        </li>
                    );
                }
            });
        }

        return (
            <ul>
                {onlineResults}
            </ul>
        )
    }
}

export default OnlinePage;

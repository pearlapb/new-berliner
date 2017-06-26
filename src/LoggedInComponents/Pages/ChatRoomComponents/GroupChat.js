import React, {Component} from 'react';
import axios from 'axios';
import {Link, browserHistory} from 'react-router';
import getSocket from '../../../socket.js';

class GroupChat extends Component {
    constructor(props) {
        super(props);
        this.state = { messages: [] };
    }

    componentDidMount() {
        let socket = getSocket();
        axios.get('/getLastMessages').then((res) => {
            this.setState({ messages: res.data.messages })
            socket.on('newMessage', (data) => {
                let messagesArray = this.state.messages;
                if (messagesArray.length < 10) {
                    messagesArray.push(data.message);
                } else {
                    messagesArray.splice(0,1);
                    messagesArray.push(data.message);
                }
                this.setState({ messages: messagesArray })
            })
        })
    }

    componentWillUnmount() {
        let socket = getSocket();
        socket.off('newMessage');
    }

    handleSending(e) {
        console.log(this.textInput.value);
        if (e.keyCode == 13) {
            e.preventDefault();
            if (this.textInput.value == '') {
                return;
            } else {
                this.sendMessage();
            }
        }
    }

    sendMessage() {
        let socket = getSocket();
        const date = new Date().toLocaleString();
        socket.emit('sendMessage', {
            message: this.textInput.value,
            name: `${this.props.firstName} ${this.props.lastName}`,
            userId: this.props.userId,
            profilePicUrl: this.props.profilePicUrl,
            dateAndTime: date
        });
        this.textInput.value = '';
    }

    render() {
        let lastMessages = "";
        if(this.state.messages) {
            let messages = this.state.messages;
            lastMessages = messages.map((message) => {
                return (
                    <div className='message'>
                        <Link to='user/{message.userId}'><img src={message.profilePicUrl}/></Link>
                        <div className="comment">
                            <p>{message.name} at {message.dateAndTime}</p>
                            <p>{message.message}</p>
                        </div>
                    </div>
                );
            });
        }

        return (
            <div id="chat-page">
                <h2>Chat with the new Berliner community!</h2>
                <div id="chat-box">
                    {lastMessages}
                </div>
                <textarea id="send-message" ref={(message) => { this.textInput = message; }} onKeyDown={this.handleSending.bind(this)}></textarea>
            </div>
        )
    }
}

export default GroupChat;

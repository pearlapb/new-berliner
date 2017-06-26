import React, {Component} from 'react';
import axios from 'axios';
import {Link, browserHistory} from 'react-router';
import getSocket from '../../../socket.js';

class SingleChat extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let socket = getSocket();
        axios.get(`/getLastMessages/${this.props.otherUserId}`).then((res) => {
            this.setState({ messages: res.data.messages })
            socket.on('personalMessage', (data) => {
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
        socket.off('personalMessage');
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
        socket.emit('sendPersonalMessage', {
            message: this.textInput.value,
            name: `${this.props.firstName} ${this.props.lastName}`,
            userId: this.props.userId,
            profilePicUrl: this.props.profilePicUrl,
            dateAndTime: date
        });
        this.textInput.value = '';
    }

    render() {
        return (
            <div id="single-chat">
                <button onClick={this.props.handleChatHide}>X</button>
                <h2>Chat with {this.props.otherUserName}</h2>
                <div id="chat-box"></div>
                <textarea id="send-message" ref={(message) => { this.textInput = message; }}></textarea>
            </div>
        )
    }
}

export default SingleChat;

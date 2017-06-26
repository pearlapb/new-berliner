import React, {Component} from 'react';
import axios from 'axios';
import {Link, browserHistory} from 'react-router';
import getSocket from '../../../socket.js';
import SingleChat from './SingleChat.js'

class SingleChatButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChatRequest() {
        this.setState({ showSingleChat : true })
        let socket = getSocket();
        //socket.emit('singleChatRequest');
    }

    handleChatHide() {
        this.setState({ showSingleChat : false })
    }

    render() {
        return (
            <div>
                <button className="single-chat-button" onClick={this.handleChatRequest.bind(this)}>Chat!</button>
                {this.state.showSingleChat &&
                    <SingleChat
                        otherUserId={this.props.otherUserId}
                        otherUserName={this.props.otherUserName}
                        userId={this.props.userId}
                        firstName={this.props.firstName}
                        lastName={this.props.lastName}
                        profilePicUrl={this.props.profilePicUrl}
                        handleChatHide={this.handleChatHide.bind(this)}
                    />
                }
            </div>
        )
    }
}

export default SingleChatButton;

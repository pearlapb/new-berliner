import React, {Component} from 'react';
import axios from 'axios';
import {Link, browserHistory} from 'react-router';
import getSocket from '../../socket.js';

import GroupChat from './ChatRoomComponents/GroupChat.js';
import SingleChat from './ChatRoomComponents/SingleChat.js';

class ChatRoomPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (
            <GroupChat firstName={this.props.firstName} lastName={this.props.lastName} userId={this.props.userId} profilePicUrl={this.props.profilePicUrl}/>
        )
    }
}

export default ChatRoomPage;

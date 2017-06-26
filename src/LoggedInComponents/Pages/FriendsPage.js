import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router';
import AllFriendRequests from './FriendsPageComponents/AllFriendRequests.js';
import AllFriendsList from './FriendsPageComponents/AllFriendsList.js';
import OnlineFriends from './FriendsPageComponents/OnlineFriends.js';

class FriendsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div id="friends-page">
                <AllFriendRequests />
                <AllFriendsList />
                <OnlineFriends />
            </div>
        )
    }
}

export default FriendsPage;

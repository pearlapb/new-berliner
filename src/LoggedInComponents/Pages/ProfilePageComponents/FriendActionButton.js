import React, {Component} from 'react';
import axios from 'axios';
import {Link, browserHistory} from 'react-router';

class FriendActionButton extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    componentDidMount() {
        const location = browserHistory.getCurrentLocation();
        let requestedId;
        if (location.pathname == '/friends') {
            requestedId = this.props.requestedIdFromFriendPage;
        } else {
            requestedId = this.props.otherUserId;
        }
        axios.get('/getFriendStatus', {
            params: { otherUserId: requestedId }
        }).then((res) => {
            let status;
            if (res.data.noRelation) {
                status = 'none';
            } else if (res.data.terminated) {
                status = 'terminated';
            } else if (res.data.cancelled) {
                status = 'cancelled';
            } else if (res.data.rejected) {
                status = 'rejected';
            } else if (res.data.pendingRequest) {
                status = 'pendingRequest';
            } else if (res.data.pendingAnswer) {
                status = 'pendingAnswer';
            } else if (res.data.accepted) {
                status = 'accepted';
            };
            this.setState({ friendStatus: status });
            this.updateButton(this.state.friendStatus);
        });
    }

    updateButton(stateOrResult) {
        let message;
        if (stateOrResult == 'none' || stateOrResult == 'terminated' || stateOrResult == 'cancelled' || stateOrResult == 'rejected') {
            message = 'Add Friend';
        } else if (stateOrResult == 'pendingRequest') {
            message = 'Cancel Request';
        } else if (stateOrResult == 'pendingAnswer') {
            message = 'Accept Request';
        } else if (stateOrResult == 'accepted') {
            message = 'Unfriend';
        }
        this.setState({ buttonText: message })
    }

    updateFriendState(friendStatus) {
        this.setState({ friendStatus: friendStatus });
        this.updateButton(friendStatus);
    }

    handleFriendAction() {
        let requestedId;
        if (location.pathname == '/friends') {
            requestedId = this.props.requestedIdFromFriendPage;
        } else {
            requestedId = this.props.otherUserId;
        }
        const userFriendshipInfo = {
            otherUserId: requestedId,
            friendStatus: this.state.friendStatus
        };
        if (this.state.friendStatus == 'none' || this.state.friendStatus == 'terminated' || this.state.friendStatus == 'cancelled' || this.state.friendStatus == 'rejected') {
            axios.post('/sendFriendRequest', userFriendshipInfo).then((res) => {
                this.updateFriendState(res.data.status);
            });
        } else if (this.state.friendStatus == 'pendingRequest') {
            axios.post('/cancelFriendRequest', userFriendshipInfo).then((res) => {
                this.updateFriendState(res.data.status);
            });
        } else if (this.state.friendStatus == 'pendingAnswer') {
            axios.post('/acceptFriendRequest', userFriendshipInfo).then((res) => {
                this.updateFriendState(res.data.status);
            });
        } else if (this.state.friendStatus == 'accepted') {
            axios.post('/unFriend', userFriendshipInfo).then((res) => {
                this.updateFriendState(res.data.status);
            });
        }
    }

    render() {
        return (
            <button className="white large" type="submit" onClick={this.handleFriendAction.bind(this)}>{this.state.buttonText}</button>
        )
    }
}

export default FriendActionButton;

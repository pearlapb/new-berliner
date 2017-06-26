import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router';
import FriendActionButton from '../ProfilePageComponents/FriendActionButton.js'

class AllFriendRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friendRequests: '',
            rejected: false
        };
    }

    componentDidMount() {
        axios.get('/getAllPendingRequests').then((res) => {
            console.log('Friend requests:', res.data.results);
            this.setState({friendRequests: res.data.results})
            console.log(this.state.friendRequests);
        })
    }

    rejectFriendRequest(e) {
        let otherUserId = e.target.name;
        const userFriendshipInfo = { otherUserId: otherUserId, friendStatus: 'pendingAnswer' };
        axios.post('/rejectFriendRequest', userFriendshipInfo).then((res) => {
            this.setState({ rejected: true })
        }).catch((err) => {
            console.log(err);
        })
    }

    render() {

        let summaryList = "";
        if(this.state.friendRequests) {
            summaryList = this.state.friendRequests.map((item) => {
                if (!this.state.rejected) {
                    return (
                        <li className='user-summary'>
                            <button className="reject-friend-button red" name={item.id} onClick={this.rejectFriendRequest.bind(this)}>X</button>
                            <Link to={item.userUrl}><img src={item.imageUrl}/></Link>
                            <p key={item.name}>{item.name}</p>
                            <FriendActionButton requestedIdFromFriendPage={item.id}/>
                        </li>
                    );
                }
            });
        }

        return (
            <ul>
                <h3>YOUR FRIEND REQUESTS</h3>
                {summaryList}
            </ul>
        )
    }
}

export default AllFriendRequests;

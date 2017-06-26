import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router';
import FriendActionButton from '../ProfilePageComponents/FriendActionButton.js'

class AllFriendsList extends Component {
    constructor(props) {
        super(props);
        this.state = { friendsList: '' };
    }

    componentDidMount() {
        axios.get('/getAllFriends').then((res) => {
            console.log('All Friends:', res.data.results);
            this.setState({ friendList: res.data.results })
        })
    }

    render() {
        let summaryList = "";
        if(this.state.friendList) {
            summaryList = this.state.friendList.map((item) => {
                return (
                    <li className='user-summary'>
                        <Link to={item.userUrl}><img src={item.imageUrl}/></Link>
                        <p key={item.name}>{item.name}</p>
                        <FriendActionButton requestedIdFromFriendPage={item.id}/>
                    </li>
                );
            });
        }

        return (
            <ul>
                <h3>YOUR FRIENDS</h3>
                {summaryList}
            </ul>
        )
    }
}

export default AllFriendsList;

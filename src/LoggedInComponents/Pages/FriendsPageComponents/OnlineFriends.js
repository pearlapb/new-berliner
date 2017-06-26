import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router';

class OnlineFriends extends Component {
    constructor(props) {
        super(props);
        this.state = { onlineFriends: '' };
    }

    componentDidMount() {
        axios.get('/getAllOnlineFriends').then((res) => {
            console.log('All Online Friends:', res.data.results);
            this.setState({ onlineFriends: res.data.results })
        })
    }

    render() {
        let summaryList = "";
        if(this.state.onlineFriends) {
            summaryList = this.state.onlineFriends.map((item) => {
                return (
                    <li className='user-summary'>
                        <Link to={item.userUrl}><img src={item.imageUrl}/></Link>
                        <p key={item.name}>{item.name}</p>
                    </li>
                );
            });
        }

        return (
            <ul>
                <h3>YOUR ONLINE FRIENDS</h3>
                {summaryList}
            </ul>
        )
    }
}

export default OnlineFriends;

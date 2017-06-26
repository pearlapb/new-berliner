import React, {Component} from 'react';
import axios from 'axios';
import {Link, browserHistory} from 'react-router';
import FriendActionButton from './ProfilePageComponents/FriendActionButton.js';
import SingleChatButton from './ChatRoomComponents/SingleChatButton.js';


class OtherUserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    componentDidMount() {
        axios.get('/userProfileInfo', {
            params: { otherUserId: this.props.params.id }
        }).then((res) => {
            console.log(res.data.result);
            if (res.data.redirect) {
                return browserHistory.push('/profile');
            } else if (res.data.noUser) {
                this.setState({ noUser: true });
            } else if (res.data.error) {
                this.setState({ error: true });
            } else {
                this.setState({
                    userId: res.data.result.userId,
                    firstName: res.data.result.firstName,
                    lastName: res.data.result.lastName,
                    profilePicUrl: res.data.result.profilePicUrl,
                    profileBio: res.data.result.profileBio,
                    hobbies: res.data.result.hobbies,
                    feedPosts: res.data.result.feedPosts,
                })
            }
        })
    }

    handleSending() {
        const postInfo = {
            profileId: this.state.userId,
            message: this.postText.value,
        };
        console.log(postInfo);
        axios.post('/postToProfileFeed', postInfo).then((res) => {
            console.log(res.data.result);
            this.setState({ feedPosts: res.data.results })
        })
    }


    render() {

        let feedPosts = "";
        if (this.state.feedPosts) {
            let allPosts = this.state.feedPosts;
            feedPosts = allPosts.map((post) => {
                return (
                    <div className='post'>
                        <Link to='user/{post.id}'><img src={post.profile_pic_url}/></Link>
                        <div className="comment">
                            <p>{post.first_name} {post.last_name} at {post.posted_at}</p>
                            <p>{post.message}</p>
                        </div>
                    </div>
                )
            })
        }

        return (
            <div id="profile-wrapper">

                <div id="profile-picture-wrap">
                    <img src={this.state.noUser || this.state.error
                        ? '/public/assets/unknown.png'
                        : this.state.profilePicUrl}
                    />
                    {!this.state.noUser && <div id="button-wrap">
                        <SingleChatButton
                            otherUserId={this.props.params.id}
                            otherUserName={this.state.firstName}
                            userId={this.props.userId}
                            firstName={this.props.firstName}
                            lastName={this.props.lastName}
                            profilePicUrl={this.props.profilePicUrl}
                        />
                    </div>}
                </div>

                {!this.state.noUser &&
                    <FriendActionButton
                        otherUserId={this.props.params.id}
                        userId={this.props.userId}
                    />
                }

                {this.state.noUser && <p>User does not exist</p>}
                {this.state.error && <p>An error occured. Sorry.</p>}

                {!this.state.noUser && !this.state.error && <div id="profile-description">
                    <h2>{this.state.firstName} {this.state.lastName}</h2>
                    <p>Bio: {this.state.profileBio != null
                            ? this.state.profileBio
                            : 'This user has not written a bio yet'}</p>
                    <p>I like: {this.state.hobbies
                            ? this.state.hobbies
                            : 'This user has not stated hobbies'}</p>
                </div>}

                <div className="line"></div>
                {!this.state.noUser && <div id="profile-posts">
                    <h2>{this.state.firstName}'s feed</h2>
                    <div id="profile-posting">
                        <textarea ref={(message) => { this.postText = message; }}></textarea>
                        <button className="blue round" onClick={this.handleSending.bind(this)}>Post</button>
                    </div>
                    <div id="profile-feed">
                        {feedPosts}
                    </div>
                </div>}

            </div>
        )
    }
}

export default OtherUserPage;

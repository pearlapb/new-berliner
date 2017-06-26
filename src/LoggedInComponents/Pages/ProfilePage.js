import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router';
import UploadProfilePic from './ProfilePageComponents/UploadProfilePic.js';
import {EditDescription, EditHobbies} from './ProfilePageComponents/EditProfile.js';

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = { showProfilePicUpload: false, showAllEditOptions: false, showEditDescription: false, showEditStay: false, showEditHobbies:false };
    }

    componentDidMount() {
        axios.get('/getProfileFeed').then((res) => {
            console.log(res.data.feedPosts);
            this.setState({ feedPosts: res.data.feedPosts })
        })
    }

    showAllEditOptions(e) {
        this.setState({ showAllEditOptions : !this.state.showAllEditOptions })
    }

    showEditDescription(e) {
        this.setState({
            showEditDescription: !this.state.showEditDescription
        })
    }

    showEditStay(e) {
        this.setState({
            showEditStay: !this.state.showEditStay
        })
    }

    showEditHobbies(e) {
        this.setState({
            showEditHobbies: !this.state.showEditHobbies
        })
    }

    handleSending() {
        const postInfo = {
            profileId: this.props.userId,
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
                    <img src={this.props.profilePicUrl}/>
                    <div id="upload-wrap"><UploadProfilePic  id="upload-wrap" setNewImage={this.props.setNewImage}/></div>
                </div>

                <button className={this.state.showAllEditOptions ? 'blue' : 'grey'} onClick={this.showAllEditOptions.bind(this)}>Edit Profile</button>

                <div id="profile-description">

                    <h2>{this.props.firstName} {this.props.lastName}</h2>

                    {!this.state.showEditDescription && <p>Bio: {this.props.profileBio != null ? this.props.profileBio : 'No bio yet'}</p>}
                    {this.state.showAllEditOptions && !this.state.showEditDescription && <button className="red" onClick={this.showEditDescription.bind(this)}>Edit Bio</button>}
                    {this.state.showEditDescription && <EditDescription id="edit-description-component"profileBio={this.props.profileBio} showEditDescription={this.showEditDescription.bind(this)} handleBioUpdate={this.props.handleBioUpdate}/>}

                    {!this.state.showEditHobbies && <p>I like: {this.props.hobbies != null ? this.props.hobbies : 'No listed hobbies'}</p>}
                    {this.state.showAllEditOptions && !this.state.showEditHobbies && <button className="red" onClick={this.showEditHobbies.bind(this)}>Edit Hobbies</button>}
                    {this.state.showEditHobbies && <EditHobbies id="edit-hobbies-component" hobbies={this.props.hobbies} showEditHobbies={this.showEditHobbies.bind(this)} handleHobbiesUpdate={this.props.handleHobbiesUpdate}/>}

                </div>

                <div className="line"></div>
                <div id="profile-posts">
                    <h2>Your feed</h2>
                    <div id="profile-posting">
                        <textarea ref={(message) => { this.postText = message; }}></textarea>
                        <button className="blue round" onClick={this.handleSending.bind(this)}>Post</button>
                    </div>
                    <div id="profile-feed">
                        {feedPosts}
                    </div>
                </div>

            </div>
        )
    }
}

export default ProfilePage;

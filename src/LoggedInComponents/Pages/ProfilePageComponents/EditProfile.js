import React, {Component} from 'react';
import axios from 'axios';

class EditDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleInput(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleDatabseUpdateBio(e) {
        e.preventDefault(e);
        const bioText = { bioText: this.state.bio };
        axios.post('/updateUserBio', bioText).then((res) => {
            if (res.data.success) {
                this.props.handleBioUpdate(res.data.bio);
                this.props.showEditDescription();
            }
        })
    }

    render() {
        return (
            <div id="edit-bio-wrapper">
                <textarea onChange={this.handleInput.bind(this)} placeholder="bio" type="text" className="red-border" name="bio">{this.props.profileBio}</textarea>
                <div className="buttons-line">
                    <button className="red" type="submit" onClick={this.handleDatabseUpdateBio.bind(this)}>Edit Bio</button>
                    <button className="red" onClick={this.props.showEditDescription}>Cancel</button>
                </div>
            </div>
        )
    }
}

class EditHobbies extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleInput(e) {
        console.log(e.target.value);
        this.setState({ hobbies: e.target.value})
    }

    handleDatabaseUpdateHobbies(e) {
        e.preventDefault();
        const hobbiesText = { hobbiesText: this.state.hobbies};
        console.log('HOBBIES TEXT:', hobbiesText);
        axios.post('/updateUserHobbies', hobbiesText).then((res) => {
            if (res.data.success) {
                console.log(res.data.hobbies);
                this.props.handleHobbiesUpdate(res.data.hobbies);
                this.props.showEditHobbies();
            }
        })
    }

    render() {
        return (
            <div id="edit-hobbies-wrapper">
                <textarea onChange={this.handleInput.bind(this)}placeholder="hobbies" type="text" className="red-border" name="hobbies">{this.props.hobbies}</textarea>
                <div className="buttons-line">
                    <button className="red" type="submit" onClick={this.handleDatabaseUpdateHobbies.bind(this)}>Edit Hobbies</button>
                    <button className="red" onClick={this.props.showEditHobbies}>Cancel</button>
                </div>
            </div>
        )
    }
}

export {EditDescription, EditHobbies};

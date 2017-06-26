import React, {Component} from 'react';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory} from 'react-router';
import axios from 'axios';
import NavBar from './NavBar.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { userId: '', firstName: '', lastName: '', profilePicUrl: '', profileBio: '' };
    }
    componentDidMount() {
        axios.get('/userProfileInfo').then((res) => {
            this.setState({
                userId: res.data.result.userId,
                firstName: res.data.result.firstName,
                lastName: res.data.result.lastName,
                profilePicUrl: res.data.result.profilePicUrl,
                profileBio: res.data.result.profileBio,
                hobbies: res.data.result.hobbies,
            })
        })
    }

    setNewImage(url) {
        this.setState({ profilePicUrl: url })
    }

    handleBioUpdate(newBio) {
        this.setState({ profileBio: newBio })
    }

    handleHobbiesUpdate(hobbies) {
        this.setState({ hobbies })
    }


    render() {
        const children = React.cloneElement(this.props.children, {
            setNewImage: this.setNewImage.bind(this),
            handleBioUpdate: this.handleBioUpdate.bind(this),
            handleHobbiesUpdate: this.handleHobbiesUpdate.bind(this),
            userId: this.state.userId,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            profilePicUrl: this.state.profilePicUrl,
            profileBio: this.state.profileBio,
            hobbies: this.state.hobbies
        });
        return (
            <div id="app-wrapper">
                <NavBar
                    userId={this.state.userId}
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    profilePicUrl={this.state.profilePicUrl}
                />
                {children}
            </div>
        )
    }
}

export default App;

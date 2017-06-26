import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router';
import SearchBar from './SearchBar.js';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = { showDropDownMenu: false, search: '' };
    }

    handleDropdownMenu(e) {
        this.setState({
            showDropDownMenu: !this.state.showDropDownMenu,
        })
    }

    handleLogoutSubmit(e) {
        e.preventDefault();
        axios.get('/userLogout').then((res) => {
            location.href='/';
        });
    }

    render() {
        return (
            <div id="navBar">
                <Link id="navbar-logo" to="/"><img src="/public/assets/smallLogo.png"/></Link>
                <SearchBar />
                <div id="menu-in-navbar">
                    <Link to="online">Who's online?</Link>
                    <Link to="chatroom">Chatroom</Link>
                    <Link to="friends">Friends</Link>
                    <div id="dropdown">
                        <img onClick={this.handleDropdownMenu.bind(this)} id="pic-dropdown-btn" src={this.props.profilePicUrl} alt={this.props.firstName + this.props.lastName}/>
                        {this.state.showDropDownMenu && <div id="dropdown-wrapper"><div className="arrow-up"></div><ul onClick={this.handleDropdownMenu.bind(this)} id="pic-dropdown-content">
                            <li><Link to="profile">Profile</Link></li>
                            <li><Link onClick={this.handleLogoutSubmit.bind(this)}>Logout</Link></li>
                        </ul></div>}
                    </div>
                </div>
            </div>
        )
    }
}


export default NavBar;

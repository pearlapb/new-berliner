
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory} from 'react-router';
import getSocket from './socket.js';

import Welcome from './LoggedOutComponents/Welcome.js';
import Login from './LoggedOutComponents/Login.js';
import Registration from './LoggedOutComponents/Registration.js';

import App from './LoggedInComponents/App.js';
import NavBar from './LoggedInComponents/NavBar.js';

import HomePage from './LoggedInComponents/Pages/HomePage.js';
import FriendsPage from './LoggedInComponents/Pages/FriendsPage.js';
import OnlinePage from './LoggedInComponents/Pages/OnlinePage.js';
import ChatRoomPage from './LoggedInComponents/Pages/ChatRoomPage.js';
import ProfilePage from './LoggedInComponents/Pages/ProfilePage.js';
import OtherUserPage from './LoggedInComponents/Pages/OtherUserPage.js';

const loggedOutRouter = (
    <Router history={hashHistory}>
        <Route path="/" component={Welcome}>
            <Route path="/login" component={Login}/>
            <IndexRoute component={Registration}/>
        </Route>
    </Router>
)

const loggedInRouter = (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route path="/friends" component={FriendsPage}/>
            <Route path="/online" component={OnlinePage}/>
            <Route path="/chatroom" component={ChatRoomPage}/>
            <Route path="/profile" component={ProfilePage}/>
            <Route path="/user/:id" component={OtherUserPage}/>
            <IndexRoute component={HomePage}/>
        </Route>
    </Router>
)

let elem;
if (location.pathname == '/Welcome') { //change to lowercase
    elem = loggedOutRouter;
} else {
    elem = loggedInRouter;
}

ReactDOM.render(
    elem,
    document.querySelector('main')
);

if (location.pathname != '/Welcome') {
    getSocket();
}

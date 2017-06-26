import React from 'react';
import Registration from './Registration.js';
import Login from './Login.js';

const Welcome = (props) => {
    return (
        <section id="welcome-component" className="component-section">
            <img src="/public/assets/smallLogo.png" id="big-welcome-logo"/>
            <h1>New to Berlin?</h1>
            {props.children}
        </section>
    )
}

export default Welcome;

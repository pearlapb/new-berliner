import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router';

/*class WelcomeForm extends Component { //make a container component that takes two presentation components: registrtion and login! the ocntainer compnent only has functionality that two UI stuff have in common!
    constructor(proos) {

    }
    handleChange() {

    }
    handleSubmit() {

    }
    render() {
        var elem = someCondition ? <Login handleChange={this.handleChange}/> : <Registration handleChange={this.handleChange}/>;
        return elem;
    }
}*/

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 'email':'', 'pw':'', showLoginButton: true };
    }

    showLoginForm(e) {
        this.setState({ showingLoginForm: true, showLoginButton: false })
    }

    handleInput(e) {
        this.setState( {[e.target.name]: e.target.value} );
    }
    handleLoginSubmit(e) {
        e.preventDefault();
        const userLoginInfo = {
            email: this.state.email,
            pw: this.state.pw
        }
        console.log(userLoginInfo);
        for (var key in userLoginInfo) {
            if (userLoginInfo[key] == '') {
                this.setState({error: 'You have to fill in the entire form.'})
                return;
            }
        }
        axios.post('/userLogin', userLoginInfo).then((res) => {
            if (res.data.success) {
                location.href = '/'; //change this to login!!
                this.setState({ success: true })
            } else {
                this.setState({ error: 'Something went wrong.' });
            }
        }).catch((err) => {
            console.log(err);
            this.setState({ error: 'Something went wrong.' });
        })
    }
    render() {
        return (
            <div className="form-wrapper">
                {this.state.showLoginButton && <div className="show-form-button-wrapper">
                    <div onClick={this.showLoginForm.bind(this)} className="show-form-button">LOG IN</div>
                    <p>Not a member yet? <Link to="/">Register</Link></p>
                    </div>
                }
                {this.state.showingLoginForm && <form id="login-form" onSubmit={this.handleLoginSubmit.bind(this)}>
                    {this.state.error && <div className="error"> {this.state.error}</div>}
                    <p id="login-form-intro">Log in</p>
                    <input onChange={this.handleInput.bind(this)} name="email" className="login-form-input" placeholder="email address"/>
                    <input onChange={this.handleInput.bind(this)} type="password" name="pw" className="login-form-input" placeholder="password"/>
                    <button type="submit" className="white">GO</button>
                </form>}
            </div>
        )
    }
}


export default Login;

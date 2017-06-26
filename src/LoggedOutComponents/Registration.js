import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = { firstName: '', lastName: '', email: '', pw: '', showRegisterButton: true, showingRegistrationForm: false };
    }

    showRegistrationForm(e) {
        this.setState({
            showingRegistrationForm: !this.state.showingRegistrationForm,
            showRegisterButton: false
         })
    }

    handleInput(e) {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleRegistrationSubmit(e) {
        e.preventDefault();
        const newUserInfo = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            pw: this.state.pw
        }
        for (var key in newUserInfo) {
            if (newUserInfo[key] == '') {
                this.setState({error: 'You need to fill in all the form!'});
                return;
            }
        }
        axios.post('/registerNewUser', newUserInfo).then((res) => {
            if (res.data.success) {
                location.href = '/';
                this.setState({ success: true })
            } else if (res.data.alreadyRegistered) {
                this.setState({ error: 'You already have an account with this email. Please Log in!' })
            } else {
                this.setState({ error: 'Something went wrong. Please try again' })
            }
        }).catch((err) => {
            console.log(err);
            this.setState({ error: 'Something went wrong. Please try again' })
        })
    }

    render() {
        return (
            <div className="form-wrapper">
                {this.state.showRegisterButton && <div className="show-form-button-wrapper">
                    <div onClick={this.showRegistrationForm.bind(this)} className="show-form-button">JOIN US</div>
                    <p>Already a member ? <Link to="Login">Log in</Link></p>
                    </div>
                }
                {this.state.showingRegistrationForm && <form onSubmit={this.handleRegistrationSubmit.bind(this)} id="registration-form">
                    {this.state.error && <div className="error"> {this.state.error}</div>}
                    <p id="registration-form-intro">Register</p>
                    <input onChange={this.handleInput.bind(this)} name="firstName" className="registration-form-input" placeholder="first name"/>
                    <input onChange={this.handleInput.bind(this)} name="lastName" className="registration-form-input" placeholder="last name"/>
                    <input onChange={this.handleInput.bind(this)} type="email" name="email" className="registration-form-input" placeholder="email address"/>
                    <input onChange={this.handleInput.bind(this)} type="password" name="pw" className="registration-form-input" placeholder="password"/>
                    <button type="submit" className="white">GO</button>
                </form>}
            </div>
        )
    }
}

export default Registration;

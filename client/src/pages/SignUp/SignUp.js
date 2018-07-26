import React, { Component } from "react";
import "./SignUp.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SubmitBtn from "../../components/SubmitBtn";
import Input from "../../components/Input";
import Container from "../../components/Container";




class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }
    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    onSubmit = event => {
        event.preventDefault();
    }

    render() {
        return (
            <Container fluid>
                <Header />
                <form className="signUp-form">
                    <h3 className="signup-heading"> Create a Profile </h3>
                    <Input
                        name='email'
                        placeholder='Email'
                        onChange={event => this.onChange(event)}
                        value={this.state.email} />
                    <Input
                        name='password'
                        placeholder='Password'
                        type='password'
                        onChange={event => this.onChange(event)}
                        value={this.state.password} />
                    <br />
                    <SubmitBtn onClick={this.onSubmit} />
                </form>
                <Footer />
            </Container>
        );
    }

}

export default SignUp;


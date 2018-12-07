import React, { Component } from "react";
import {
	HelpBlock,
	FormGroup,
	FormControl,
	ControlLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import { Auth, API } from "aws-amplify";
import FacebookButton from "../components/FacebookButton";

export default class Signup extends Component {
	constructor(props) {
	super(props);

	this.state = {
		isLoading: false,
		email: "",
		password: "",
		firstname: "",
		lastname: "",
		confirmPassword: "",
		confirmationCode: "",
		newUser: null
	};
}


validateForm() {
	return (
		this.state.email.length > 0 &&
		this.state.password.length > 0 &&
		this.state.password === this.state.confirmPassword
	);
}


validateConfirmationForm() {
	return this.state.confirmationCode.length > 0;
}

handleChange = event => {
	this.setState({
		[event.target.id]: event.target.value
	});
}


handleSubmit = async event => {
	const { firstname, lastname, email, password } = this.state;
	event.preventDefault();
	this.setState({ isLoading: true });
	try {
		const newUser = await Auth.signUp({
			username: email,
			password: password,
			'attributes':{
				given_name: firstname,
				family_name: lastname
			}
		});
		this.setState({
			newUser
		});
	} catch (e) {
		alert(e.message);
	}
	this.setState({ isLoading: false });
}

// Creates the user in users table
createUser(firstName, lastName, emailId) {
	return API.post("api", "/api/user", {
		body: {
			firstName,
			lastName,
			emailId,
			role: 'developer',
		}
	});
}

handleConfirmationSubmit = async event => {
	const { firstname, lastname, email, password, confirmationCode } = this.state;
	event.preventDefault();
	this.setState({ isLoading: true });
	try {
		await Auth.confirmSignUp(email, confirmationCode);
		await Auth.signIn(email, password);
		await this.createUser(firstname, lastname, email)
		this.props.userHasAuthenticated(true);
		this.props.history.push("/");
		window.location.reload();
	} catch (e) {
		alert(e.message);
		this.setState({ isLoading: false });
	}
}

handleFbLogin = () => {
  this.props.userHasAuthenticated(true);
};

renderConfirmationForm() {
	return (
		<form onSubmit={this.handleConfirmationSubmit}>
			<FormGroup controlId="confirmationCode" bsSize="large">
				<ControlLabel>Confirmation Code</ControlLabel>
				<FormControl
					autoFocus
					type="tel"
					value={this.state.confirmationCode}
					onChange={this.handleChange}
				/>
				<HelpBlock>Please check your email for the code.</HelpBlock>
			</FormGroup>
			<LoaderButton
				block
				bsSize="large"
				disabled={!this.validateConfirmationForm()}
				type="submit"
				isLoading={this.state.isLoading}
				text="Verify"
				loadingText="Verifying…"
			/>
		</form>
	);
}

renderForm() {
	return (
		<form onSubmit={this.handleSubmit}>
			<FormGroup controlId="firstname" bsSize="large">
				<ControlLabel>First Name</ControlLabel>
				<FormControl
					autoFocus
					value={this.state.firstname}
					type="text"
					onChange={this.handleChange}
				/>
			</FormGroup>
			<FormGroup controlId="lastname" bsSize="large">
				<ControlLabel>Last Name</ControlLabel>
				<FormControl
					value={this.state.lastname}
					type="text"
					onChange={this.handleChange}
				/>
			</FormGroup>
			<FormGroup controlId="email" bsSize="large">
				<ControlLabel>Email</ControlLabel>
				<FormControl
					type="email"
					value={this.state.email}
					onChange={this.handleChange}
				/>
			</FormGroup>
			<FormGroup controlId="password" bsSize="large">
				<ControlLabel>Password</ControlLabel>
				<FormControl
					value={this.state.password}
					onChange={this.handleChange}
					type="password"
				/>
			</FormGroup>
			<FormGroup controlId="confirmPassword" bsSize="large">
				<ControlLabel>Confirm Password</ControlLabel>
				<FormControl
					value={this.state.confirmPassword}
					onChange={this.handleChange}
					type="password"
				/>
			</FormGroup>
			<LoaderButton
				block
				bsSize="large"
				disabled={!this.validateForm()}
				type="submit"
				isLoading={this.state.isLoading}
				text="Signup"
				loadingText="Signing up…"
			/>
		</form>
	);
}

render() {
	return (
		<div className="Signup">
			{this.state.newUser === null
				? this.renderForm()
				: this.renderConfirmationForm()}
		</div>
	);
}
}
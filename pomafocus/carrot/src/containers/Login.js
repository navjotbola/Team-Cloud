import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import { Auth } from "aws-amplify";
import FacebookButton from "../components/FacebookButton";
import GoogleButton from "../components/GoogleButton";

export default class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			email: "",
			password: ""
		};
	}

	validateForm() {
		return this.state.email.length > 0 && this.state.password.length > 0;
	}

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleSubmit = async event => {
		event.preventDefault();
		this.setState({ isLoading: true });
		try {
			await Auth.signIn(this.state.email, this.state.password);
			this.props.userHasAuthenticated(true);
			window.location.reload();
		} catch (e) {
			alert(e.message);
			this.setState({ isLoading: false });
		}
	}

	handleFbLogin = (reponse, user) => {
  		this.props.userHasAuthenticated(true);
		this.props.userHasFedAuthenticated(true);
		this.props.setupFedUserInfo(user);
		// window.location.reload();
	};

	handleGoogleLogin = (reponse, user) => {
		this.props.userHasAuthenticated(true);
		this.props.userHasFedAuthenticated(true);
		//window.location.reload();	
		this.props.setupFedUserInfo(user);
	};

	render() {
		return (
			<div className="Login">
				<form onSubmit={this.handleSubmit}>
					<FacebookButton
	  					onLogin={this.handleFbLogin}
					/>
					<hr />
					<GoogleButton
	  					onLogin={this.handleGoogleLogin}
					/>
					<hr />
					<FormGroup controlId="email" bsSize="large">
						<ControlLabel>Email</ControlLabel>
						<FormControl
							autoFocus
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
					<LoaderButton
						block
						bsSize="large"
						disabled={!this.validateForm()}
						type="submit"
						isLoading={this.state.isLoading}
						text="Login"
						loadingText="Logging in…"
					/>
				</form>
			</div>
		);
	}
}

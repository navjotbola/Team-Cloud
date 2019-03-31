import { Auth } from "aws-amplify";
import React, { Component } from "react";
import "./home.css";
import Lander from "./Lander";
import PomaHome from "./PomaHome";

export default class Home extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			email: false,
			firstname: "",
			lastname: "",
			sub: ""
		};
	}

	async componentDidMount() {
		if (!this.props.isAuthenticated) {
			return;
		}
		this.getUserInfo();
		this.setState({ isLoading: false });
	}

	async getUserInfo() {
		const info = await Auth.currentAuthenticatedUser();
		// console.log(info);
		if(this.props.isAuthenticated)
		{
			console.log(info);
			const id = info ? info.id : null
			// Fetch id
			this.setState({id});
			// this.props.setUserId(info ? info.id : null);

			// Fetch email
			var strEmail = info.attributes ? info.attributes['email'] : info.email;
			if(strEmail.trim() === "admin@example.com")
			this.setState({email : true});
			
			// Fetch firstname
	    	var strFirstName = info.attributes ? info.attributes['given_name'] : info.name.split(" ")[0];
	    	this.setState({firstname : strFirstName });
			
			// Fetch lastname
			var strLastName = info.attributes ? info.attributes['family_name'] : info.name.split(" ")[1];
			this.setState({lastname : strLastName });
			
			if (!id) {
				const test = await Auth.currentUserInfo();
				console.log(test);
				this.setState({id: test.id});
			}
	    }
	}
	render() {
		const { firstname, lastname, email, id } = this.state;
		return (
			<div className="Home">
				{this.props.isAuthenticated ? <PomaHome firstname={firstname} lastname={lastname} id={id} email={email}/> : <Lander/>}
			</div>
		);
	}
}
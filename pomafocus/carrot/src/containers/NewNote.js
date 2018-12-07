import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewNote.css";
import { API } from "aws-amplify";

export default class NewNote extends Component {
	constructor(props) {
		super(props);
		this.file = null;
		this.state = {
			isLoading: null,
			content: "",
			travelDate: "",
			description: ""
		};
	}

	validateForm() {
		
		return this.state.content.length > 0 && this.state.travelDate != null && this.state.description.length > 0;
	}	
	
	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}
	
	handleFileChange = event => {
		this.file = event.target.files[0];
	}
	
	handleSubmit = async event => {
		event.preventDefault();
		if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
			alert(`Please pick a file smaller than
			${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
			return;
		}
		this.setState({ isLoading: true });
		try {
			const attachment = "";
			await this.createNote({
				attachment,
				content: this.state.content,
				travelDate: this.state.travelDate,
				description: this.state.description
			});
			this.props.history.push("/");
		} catch (e) {
			alert(e);
			this.setState({ isLoading: false });
		}
	}


	createNote(note) {
		return API.post("notes", "/notes", {
			body: note
		});
	}
	
	render() {
		return (
			<div className="NewNote">
				<form onSubmit={this.handleSubmit}>
					<FormGroup controlId="travelDate">
						<ControlLabel>Travel date</ControlLabel>
						<FormControl	
							value={this.setState.travelDate}
							onChange={this.handleChange}
							type="date"
						/>
					</FormGroup>
					<FormGroup controlId="description">
						<ControlLabel>Travel description</ControlLabel>
						<FormControl
							onChange={this.handleChange}
							value={this.state.description}
							type="text"
						/>
					</FormGroup>
					<FormGroup controlId="content">
						<ControlLabel>Travel Notes</ControlLabel>
						<FormControl
							onChange={this.handleChange}
							value={this.state.content}
							componentClass="textarea"
						/>
					</FormGroup>
					<FormGroup controlId="file">
						<ControlLabel>Memory Captured</ControlLabel>
						<FormControl onChange={this.handleFileChange} type="file"/>
					</FormGroup>
					<LoaderButton
						block
						bsStyle="primary"
						bsSize="large"
						disabled={!this.validateForm()}
						type="submit"
						isLoading={this.state.isLoading}
						text="Create"
						loadingText="Creating…"
					/>
				</form>
			</div>
		);
	}
}
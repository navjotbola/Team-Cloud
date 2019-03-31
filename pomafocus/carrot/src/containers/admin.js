import React, { Component } from "react";
import { PageHeader, ListGroup } from "react-bootstrap";
import "./home.css";
import { API } from "aws-amplify";
import { Auth } from "aws-amplify";

import ReactTable from "react-table";
import "react-table/react-table.css";

import Moment from "moment";

export default class Admin extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			email: false,
			firstname: "",
			lastname: "",
			notes: []
		};
	}

	async componentDidMount() {
		if (!this.props.isAuthenticated) {
			return;
		}
		try {
			const notes = await this.notes();
			this.setState({ notes });
		} catch (e) {
			alert(e);
		}
				
		const info = await Auth.currentUserInfo();

    	var strFirstName = info.attributes['given_name'];
    	this.setState({firstname : strFirstName });

    	var strLastName = info.attributes['family_name'];
    	this.setState({lastname : strLastName });

		this.setState({ isLoading: false });
	}

	notes() {
		return API.get("notes", "/notesadmin");
	}

	renderNotesTable(){
		const convertedObject = Object.values(this.state.notes);

		return (
			
			<div>
			<ReactTable

			getTdProps={(state, rowInfo, column, instance) => {
				return {
					onClick: (e, handleOriginal) => {
						var href= "/notes/" + rowInfo.row.noteId;

						this.props.history.push(href);
					}
				};
			}}

			
			data={convertedObject}
			columns={[
				{
					Header: "Your Travel Notes",
					columns: [
					{
						Header: "Description",
						accessor: "description"
					},
					{
						id: "createdAt",
						Header: "Created on",
						accessor: d => {
							return Moment(d.createdAt).local().format("DD-MM-YYYY hh:mm:ss a")
						}

					},
					{
						id: "updatedAt",
						Header: "Updated on",
						accessor: d => {
							return Moment(d.updatedAt).local().format("DD-MM-YYYY hh:mm:ss a")
						}

					},
					{
						Header: "Note ID",
						id: "noteId",
						accessor: d => d.noteId,
						show: true
					}
					]
				}
				]}
				defaultPageSize={10}
				className="-striped -highlight"
				/>
				<br />
				</div>
				);   
			}


	renderNotes() {
		return (
			<div className="notes">
				<PageHeader>Welcome ADMIN: {this.state.firstname} {this.state.lastname}</PageHeader>


				<table>
					<tr>
						<ListGroup>
							{!this.state.isLoading &&   this.renderNotesTable(this.state.notes)}
						</ListGroup>
					</tr>
				</table>
			</div>

		);
	}

	render() {
		return (
			<div className="Admin">
				{this.renderNotes()}
			</div>
		);
	}
}
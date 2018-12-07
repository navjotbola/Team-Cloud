import _ from "lodash";
import { API } from "aws-amplify";
import React, { Component } from "react";
import { Panel, Alert, Badge, Jumbotron, ControlLabel, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import classNames from "classnames";
import "./manage.css";
import { TASK_STATUS } from "../../constants";
import PomaAddProjectModal from "../../components/PomaAddProjectModal";
import { Bar as BarChart, Pie as PieChart } from 'react-chartjs';
import moment from "moment";

var randomColor = require('randomcolor'); // import the script
const { DONE } = TASK_STATUS;

export default class Manage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			projects: [],
			showAddProjectModal: false,
			addProjectModalData: {},
			loading: true,
			chartData: {}
		};
	};

	async componentDidMount() {
        if (this.props.id) {
			// Fetch tasks this user is working on
            const projects = await this.getUserProjectsAndTasks();
            const projectsList = projects[0];
			projectsList.concat(projects[1]);
			projectsList.forEach(async (project, index) => {
				const labels = [];
				const data = [];
				const fillColor = [];
				const { projectOwner, projectContributors, tasks } = project;
				const { values } = projectContributors;
				values.forEach(async (user) => {
					const userInfo = await this.getUserInfo(user);
					const { firstName, lastName, userId } = userInfo;
					labels.push(`${firstName} ${lastName}`);
					const count = _.filter(tasks, (task) => { if (task.userId === userId) return task }).length;
					data.push(count);
					fillColor.push(randomColor());
				});
				// const ownerInfo = projectOwner ? await this.getUserInfo(projectOwner) : null;
				// const { firstName, lastName, userId } = ownerInfo;
				// labels.push(`${firstName} ${lastName}`);
				// const count = _.filter(tasks, (task) => { if (task.userId === userId) return task }).length;
				// data.push(count);
				// fillColor.push(randomColor());
				const chartData = {
					labels,
					datasets: [
						{
							label: "My First dataset",
							fillColor,
							data,
						}
					]
				};
				projectsList[index].chartData = chartData;
			});
			// TODO: Find a better way to achieve this without a forced set timeout.
			setTimeout(() => { this.setState({ projects: projectsList, loading: false }) }, 1000);
        } else {
			this.setState({ projects: [], loading: false });				
		}
    }

	getUserProjectsAndTasks = () => API.get("api", "/api/project/detail");

	getUserTasks = (userId) => API.get("api", `/api/user/${userId}`);

	getTaskInfo = (taskId) => API.get("api", `/api/task/${taskId}`);

	getProjectInfo = (projectId) => API.get("api", `/api/project/${projectId}`);

    getUserInfo = (userId) => API.get("api", `/api/user/${userId}`);

	handleClick = (projectData) => {
		this.setState({ showAddProjectModal: true, addProjectModalData: projectData })
	};

	handleProjectModalHide = (data, isSubmit) => {
		this.setState({ showAddProjectModal: false });
		if (!isSubmit) {
			return;
		} else {
			const { projectId, projectStatus, projectName, projectDescription, projectContributorsIDs, startDate, endDate } = data;
			API.put("api", `/api/project/${projectId}`, {
				body: {
					projectName,
					projectDescription,
					projectStatus,
					projectOwner: this.props.id,
					projectContributors: projectContributorsIDs,
					projectStartDate: startDate.format('X') * 1000,
					projectEndDate: endDate.format('X')  * 1000,
				}
			}).then(() => {
				window.location.reload();
			});	
		}
	}

	renderProjectPanel = (project) => {
		const { projectEndDate, chartData, tasks, projectName } = project;
		const taskCount = this.countTasks(tasks);
		const pieData = [
			{ color:  "#32CD32", label: "Completed", value: taskCount.completed },
			{ color:  "#f93d2f", label: "Not complete", value: taskCount.toComplete }
		]
		console.log(chartData);
		const barChart = (chartData.datasets && chartData.datasets.length) ? <BarChart data={chartData}/> : <Alert><h3>No data to show</h3></Alert>
		const pieChart = !(taskCount.completed === 0 && taskCount.toComplete === 0) ? <PieChart data={pieData}/> : <Alert><h3>No data to show</h3></Alert>
		const tasksDisplay = !tasks.length ? <Alert><h3 className="text-center">No tasks exist under this project</h3></Alert> :
		(tasks.map((task) => {
			const { taskId, taskName, taskStatus, taskDescription } = task;
			return(<div key={taskName} className="inline">
				<LinkContainer to={`/tasks/${taskId}`}>
					<div className={classNames("task-card animated fadeIn", taskStatus === DONE ? "done" : null)}>
						<div className="task-card-title">{taskName}</div>
						<hr className="mb-3 mt-3"/>
						<span>{taskDescription}</span>
					</div>
				</LinkContainer>
			</div>)
		}))
		return (
		<Panel key={projectName} id="collapsible-panel-example-2" defaultExpanded>
			<Panel.Heading>
			  	<Panel.Title className="text-center">
					<Panel.Toggle componentClass="a">
						<Badge className="pull-left mr-2">{taskCount.toComplete} left</Badge>
						<Badge className="pull-left">{taskCount.completed} completed</Badge>
					</Panel.Toggle>
					<span className="pointer" onClick={() => this.handleClick(project)}><i className="fas fa-pencil-alt"/>{ projectName }</span>
					<Panel.Toggle componentClass="a">
						<span className="pull-right"><i className="far fa-eye"/></span>
						<span className="pull-right"><i className="far fa-eye-slash"/></span>					
					</Panel.Toggle>
			  	</Panel.Title>
			</Panel.Heading>
			<Panel.Collapse>
			  	<Panel.Body>
					{ tasksDisplay }
			  	</Panel.Body>
				<Jumbotron className="mb-0 br-0 text-center">
					<Row className="show-grid mb-4">
						<Col xs={6} md={4}>
							<strong>Task distribution</strong>
						</Col>
						<Col xs={6} md={4}>
							<strong>Task status breakdown</strong>
						</Col>
						<Col xs={6} md={4}>
							<strong>Project end date</strong>
						</Col>
					</Row>
					<Row className="show-grid">
						<Col xs={6} md={4}>
							{ barChart }
						</Col>
						<Col xs={6} md={4}>
							{ pieChart }
						</Col>
						<Col xs={6} md={4}>
							<h2>{Math.abs(moment({hours: 0}).diff(Number(projectEndDate), 'days'))} days</h2>
						</Col>
					</Row>
				</Jumbotron>
			</Panel.Collapse>
		</Panel>
		)
	};

	countTasks = (tasks) => {
		let toComplete = 0;
		let completed = 0;
		tasks.forEach((task) => {
			const { taskStatus } = task;
			if (taskStatus === DONE) {
				completed = completed + 1;
			} else {
				toComplete = toComplete + 1;
			}
		})
		return { toComplete, completed }
	}

	
	render() {
		const { showAddProjectModal, addProjectModalData, loading } = this.state;
		const { projects } = this.state;
		let alert = null;
		if (!Object.keys(projects).length) {
			alert = (
				<Alert className="info text-center">
					<div><strong>You are currently not managing any projects!</strong></div>
					<div>Head back to the homepage and start creating some!</div>
				</Alert>
			)
		}
		if (loading) {
			alert = (
				<div className="text-center mt-3x">
					<i className="fas fa-spinner fa-spin fa-5x mt-100"/>
				</div>
			)
		}
		return (
			<div className="tasks-container animated fadeIn">
				{ alert }
				{
					projects.map((project) => {
						return this.renderProjectPanel(project);
					})
				}
				{
					showAddProjectModal ? <PomaAddProjectModal show={showAddProjectModal} handleClose={this.handleProjectModalHide} data={addProjectModalData} edit/> : null
				}
			</div>
		);
	}
}
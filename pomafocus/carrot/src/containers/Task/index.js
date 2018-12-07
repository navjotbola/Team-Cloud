import { API } from "aws-amplify";
import React, { Component } from "react";
import { Button, Alert } from "react-bootstrap";
import classNames from "classnames";
import "./task.css";
import { TASK_STATUS, NONE_VALUE } from "../../constants";
import PomaAddTaskModal from "../../components/PomaAddTaskModal";
import moment from "moment";

const { DONE } = TASK_STATUS;

export default class Task extends Component {
	constructor(props) {
		super(props);
		console.log(this.props);
		this.state = {
			addTaskModalData: {},
			taskPriority: null,
			showAddTaskModal: false,
			taskName: null,
			taskPomodoroCount: null,
			taskPomodoroStartTime: null,
			taskPomodoroEndTime: null,
			taskStatus: null,
			projectId: null,
			taskDescription: null,
			firstName: null,
			lastName: null,
			emailId: null,
			taskId: null,
			userId: null,
			deleting: false,
			projectOwner: null
		};
	}

	async componentDidMount() {
		const location = this.props.location.pathname.split("/");
		// Fetch task info
		const taskInfo = await this.getTaskInfo(location[location.length - 1]);
		const { taskName, taskPriority, taskPomodoroCount, taskPomodoroStartTime, taskPomodoroEndTime, taskStatus, projectId, taskDescription, userId, taskId } = taskInfo;
		// Fetch task assignee info
		const userInfo = await this.getUserInfo(userId)
		const { firstName, lastName, emailId } = userInfo;
		// Fetch task project info
		const projectInfo = await this.getProjectInfo(projectId)
		const { projectName, projectOwner } = projectInfo;
		this.setState({
			taskName,
			taskPomodoroCount,
			taskPriority,
			taskPomodoroStartTime,
			taskPomodoroEndTime,
			taskStatus,
			projectName,
			taskDescription,
			userId,
			projectId,
			projectOwner,
			firstName,
			lastName,
			emailId,
			taskId
		})
	}

	getTaskInfo = (taskId) => API.get("api", `/api/task/${taskId}`);

	getUserInfo = (userId) => API.get("api", `/api/user/${userId}`);

	getProjectInfo = (projectId) => API.get("api", `/api/project/${projectId}`);

	goBack = () => {
		this.props.history.push("/tasks");
	}

	editTask = () => {
		this.setState({ showAddTaskModal: true, addTaskModalData: this.state })
	}

	deleteTask = (confirmed) => {
		const { taskId } = this.state;
		this.setState((prevState) => {
            return { deleting: !prevState.deleting };
        })
		if (confirmed) {
			// Delete
			API.del("api", `/api/task/${taskId}`).then(() => {
				this.props.history.push("/tasks");
			});
		}
	}

	handleTaskModalHide = (data, isSubmit) => {
		this.setState({ showAddTaskModal: false });
		if (!isSubmit) {
			return;
		} else {
			const { taskId, taskName, taskPriority, taskDescription, taskStatus, taskPomodoroCount, userId } = data;
			API.put("api", `/api/task/${taskId}`, {
				body: {
					taskId,
					taskName,
					taskDescription,
					taskPriority,
					taskStatus,
					taskPomodoroCount,
					userId,
				}
			}).then(() => {
				this.getSchedule().then(() => {
					window.location.reload();
				});
			});	
		}
	}

	getSchedule = () => {
        return API.get("api", "/api/schedule", {
            queryStringParameters: {
                startDate: moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
                endDate: moment().add(1, 'weeks').format('YYYY-MM-DDTHH:mm:ss.SSS'),
                create: true
            },
        });
	};

	renderDeleteAlert = () => {
		return(<Alert bsStyle="danger" onDismiss={this.handleDismiss}>
			<h4>Deleting this task!</h4>
			<p>You are about to delete a task. This action is irreversible and should be done with caution.</p>
			<div className="pull-right">
				<Button className="mr-3" bsStyle="danger" onClick={() => this.deleteTask(true)}>Delete this task</Button>
				<Button onClick={() => this.deleteTask(false)}>Cancel</Button>
			</div>
		</Alert>)
	}

	render() {
		const {
			deleting,
			showAddTaskModal,
			addTaskModalData,
			taskName,
			taskDescription,
			taskPomodoroCount,
			taskPomodoroEndTime,
			taskPomodoroStartTime,
			taskStatus,
			projectName,
			firstName,
			lastName,
			emailId,
			taskId,
			userId,
			projectOwner
		} = this.state;
		console.log('projectOwner', projectOwner)
		console.log('userId', userId);
		const canEdit = (userId === this.props.id) || (this.props.id === projectOwner);
		const editButton = canEdit ? <Button onClick={this.editTask} className="ml-3 btn-toolbar pull-right transition"><i className="mr-0 fas fa-pencil-alt"/></Button> : null;
		const deleteButton = canEdit ? <Button onClick={() => this.deleteTask(false)} className="btn-toolbar pull-right transition"><i className="mr-0 fas fa-trash-alt"/></Button> : null;
		return (
			<div className="task-container">
				<div className="task-menu-bar animated fadeIn">
					<Button onClick={this.goBack} className="btn-add pull-right transition ml-3">Back</Button>
					{ editButton }
					{ deleteButton }
				</div>
				{ deleting ? this.renderDeleteAlert() : null }
				<div className={classNames("task-card-big shadow animated fadeIn", taskStatus === DONE ? "done-big" : null)}>
					<span className="pull-left">{taskId}</span>
					<hr className="mb-3 mt-3x"/>
					<div className="text-left pull-left w-60">
						<h3 className="task-card-title-big">{taskName}</h3>
						<span className="task-card-text-block">{taskDescription}</span>
					</div>
					<div className="text-left pull-right w-40">
						<span className="task-card-text-label mt-4x">Task Status:</span>
						<h5 className="task-card-text-block">{taskStatus}</h5>
						<span className="task-card-text-label">Start time:</span>
						<h5 className="task-card-text-block">{taskPomodoroStartTime || NONE_VALUE}</h5>
						<span className="task-card-text-label">End time:</span>
						<h5 className="task-card-text-block">{taskPomodoroEndTime || NONE_VALUE}</h5>
						<span className="task-card-text-label">Assignee:</span>
						<h5 className="task-card-text-block"><i className="fas fa-user fa-fw"/>{`${firstName} ${lastName} - ${emailId}`}</h5>
						<span className="task-card-text-label">Project:</span>
						<h5 className="task-card-text-block">{projectName}</h5>
					</div>
				</div>
				{
					showAddTaskModal ? 	<PomaAddTaskModal show={showAddTaskModal} handleClose={this.handleTaskModalHide} id={this.props.id} data={addTaskModalData} edit/> : null
				}
			</div>
		);
	}
}
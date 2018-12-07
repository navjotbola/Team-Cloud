import React, { Component } from "react";
import { API } from "aws-amplify";
import { Modal, Button, Badge, FormControl } from "react-bootstrap";
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import moment from 'moment';
import { ADD_PROJECT_MODAL } from "../constants";

const { EDIT_TITLE, ADD_TITLE } = ADD_PROJECT_MODAL;

export default class PomaAddProjectModal extends Component {

	constructor(props) {
        super(props);
		this.state = {
            step: 0,
            projectName: '',
            projectDescription: '',
            contributors: '',
            projectContributors: [],
            projectContributorsIDs: [],
            startDate: null,
            endDate: null,
            error: null,
		};
    }

    async componentDidMount() {
        if (!this.props.data) {
            return;
        }
        const { projectId, projectStatus, projectName, projectDescription, projectContributors, projectEndDate, projectStartDate, } = this.props.data;
        const projectContributorsList = [];
        projectContributors.values.forEach(async (contributor) => {
            const userInfo = await this.getUserInfo(contributor);
            projectContributorsList.push(userInfo.emailId);
        });

        this.setState({
            projectId,
            projectStatus,
            projectName,
            projectDescription,
            projectContributors: projectContributorsList,
            projectContributorsIDs: projectContributors.values,
            startDate: moment(Number(projectStartDate)),
            endDate: moment(Number(projectEndDate))
        });
    }

    componentWillReceiveProps() {
        this.setState({ step: 0 });
    }

    next = () => {
        this.setState((prevState) => {
            return { step: prevState.step + 1 };
        })
    }

    back = () => {
        this.setState((prevState) => {
            return { step: prevState.step - 1 };
        })
    }

    handleChange = (e) => {
        const { target: { id, value } } = e;
        this.setState({ [id]: value });
    }

    handleEmailEnter = async (e) => {
        const { target: { value }, charCode } = e;
        if (charCode === 13) {
            e.preventDefault();
            const subId = await this.getUserInfoFromEmail(value);
            const { userId } = subId.Items.length ? subId.Items[0] : { userId: null };
            if (userId) {
                this.setState((prevState) => {
                    let newContributorsList = prevState.projectContributors;
                    let newContributorsListIDs = prevState.projectContributorsIDs;
                    newContributorsList.push(value);
                    newContributorsListIDs.push(userId);
                    return { projectContributors: newContributorsList, projectContributorsIDs: newContributorsListIDs, contributors: '', error: null };
                });
            } else {
                this.setState({
                    error: `No user for the email (${value}) exists.`,
                })
            }
        }
    }

    getUserInfoFromEmail = (email) => {
        return API.get("api", "/api/user", {
            queryStringParameters: {
                emailId: email,
            },
        });
    };

	getUserInfo = (userId) => API.get("api", `/api/user/${userId}`);

    deleteContributor = (index) => {
        this.setState((prevState) => {
            let newContributorsList = prevState.projectContributors;
            let newContributorsListIDs = prevState.projectContributorsIDs;
            newContributorsList.splice(index, 1);
            newContributorsListIDs.splice(index, 1);
            return { projectContributors: newContributorsList, projectContributorsIDs: newContributorsListIDs, contributors: '' };
        })
    }

    renderStep1() {
        return (
            <form className="animated fadeIn">
                <FormControl
                    id="projectName"
                    type="text"
                    label="Text"
                    placeholder="Project name"
                    value={this.state.projectName}
                    onChange={this.handleChange}
                />
                <FormControl
                    id="projectDescription"
                    type="text"
                    label="Text"
                    placeholder="Description"
                    value={this.state.projectDescription}
                    onChange={this.handleChange}
                />
            </form>
        )
    }

    renderStep1 = () => {
        return (
            <form className="animated fadeIn">
                <FormControl
                    id="projectName"
                    type="text"
                    label="Text"
                    placeholder="Project name"
                    value={this.state.projectName}
                    onChange={this.handleChange}
                />
                <FormControl
                    id="projectDescription"
                    type="text"
                    label="Text"
                    placeholder="Description"
                    value={this.state.projectDescription}
                    onChange={this.handleChange}
                />
            </form>
        )
    }

    renderStep2 = () => {
        return (
            <div className="text-center animated fadeIn">
                <i className="far fa-clock" />
                <DateRangePicker
                    startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                    endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                    onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
                    focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                    onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                />
            </div>
        )
    }

    renderStep3 = () => {
        const { projectContributors } = this.state;
        return (
            <div className="text-center animated fadeIn">
                <form className="animated fadeIn">
                    <FormControl
                        id="contributors"
                        type="text"
                        label="Text"
                        placeholder="Enter an email and press enter"
                        value={this.state.contributors}
                        onChange={this.handleChange}
                        onKeyPress={this.handleEmailEnter}
                    />
                </form>
                <div className="flex-container">
                {
                    projectContributors.map((contributor, index) => {
                        return <Badge key={index} className="contributor-label"><i className="far fa-times-circle remove-circle" onClick={() => this.deleteContributor(index)}/>{contributor}</Badge>
                    })
                }
                </div>
            </div>
        )
    }

    renderStep4 = () => {
        const { projectContributors, projectName, projectDescription, startDate, endDate } = this.state;
        return (
            <div>
               <div><strong>Project Name: </strong>{projectName}</div>
               <div><strong>Project Description: </strong>{projectDescription}</div>
               <div><strong>Start date: </strong>{moment(startDate).format('MMM Do YY')}</div>
               <div><strong>End date: </strong>{moment(endDate).format('MMM Do YY')}</div>
               <div className="flex-container">
                    <strong>Project Contributors: </strong>
                {
                    projectContributors.map((contributor, index) => {
                        return <Badge key={index} className="contributor-label">{contributor}</Badge>
                    })
                }
                </div>
            </div>
        )
    }

	render() {
        const steps = [
            {
                title: 'Project Details',
                content: this.renderStep1(),
            },
            {
                title: 'Timeline',
                content: this.renderStep2(),
            },
            {
                title: 'Contributors',
                content: this.renderStep3(),
            },
            {
                title: 'Review',
                content: this.renderStep4(),
            },
        ]
        let stepBadges = [];
        steps.forEach((step, index) => {
            stepBadges.push(<Badge key={index} className={index === this.state.step ? 'active' : ''}>{step.title}</Badge>)
        });

        return (
            <Modal show={this.props.show} onHide={() => this.props.handleClose(null, false)} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.edit ? EDIT_TITLE : ADD_TITLE}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-step-badges"> 
                        { stepBadges }
                    </div>    
                    <div className="modal-step-body">{ steps[this.state.step].content }</div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="pull-left error-text">{ this.state.error }</div>
                    <Button className="btn-poma-cancel" onClick={() => this.props.handleClose(null, false)}>Close</Button>
                    <Button className="btn-poma transition" onClick={this.back} disabled={this.state.step === 0}>Back</Button>
                    {this.state.step !== steps.length-1 &&
                        <Button className="btn-poma" onClick={this.next} disabled={this.state.step === steps.length-1}>Next</Button>
                    }
                    {this.state.step === steps.length-1 &&
                        <Button className="btn-poma" onClick={() => this.props.handleClose(this.state, true)}>Submit</Button>
                    }
                </Modal.Footer>
            </Modal>
		);
	}
}
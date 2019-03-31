import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const SortableItem = SortableElement(({value}) =>
  <li className="SortableItem">{value}</li>
);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul className="SortableList">
        {items.map((value, index) => {
            const { taskPomodoroEndTime, taskName, taskId } = value;
            return <SortableItem disabled={!!taskPomodoroEndTime} key={taskId} index={index} value={taskName} />
        })}
    </ul>
  );
});

export default class SetPriorityModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: this.props.tasks
        }
    }
    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState({
            tasks: arrayMove(this.state.tasks, oldIndex, newIndex),
        });
    };
    
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Set task priority</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SortableList items={this.state.tasks} onSortEnd={this.onSortEnd} helperClass="SortableHelper"/>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn-poma-cancel" onClick={() => this.props.handleClose(null, false)}>Close</Button>
                    <Button className="btn-poma" onClick={() => this.props.handleClose(this.state, true)}>Submit</Button>
                </Modal.Footer>
            </Modal>
		);
	}
}
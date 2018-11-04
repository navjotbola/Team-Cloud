import React, { Component, Fragment } from 'react';
import axios from 'axios';
import ReactJson from 'react-json-view'
import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class MediaPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: {},
      text: '',
    };
  }

  callApi = async (id) => {
    axios.post('/mediaPost', {
        altText: id
      })
      .then((response) => {
        this.setState({response: response});
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleBtnClick() {
    this.callApi(this.state.text);
  }

  onChange(e){
    this.setState({text: e.target.value})
  }

  render() {
    const { response } = this.state;
    return (
        <Form>
            <FormGroup row>
                <Label sm={2}>AltText</Label>
                <Col sm={10}>
                    <Input onChange={e => this.onChange(e)} type="text" className="pull-right" placeholder="alText goes here" />
                    <Button onClick={() => this.handleBtnClick()} className="m-1 float-sm-right" id="twitter-btn">Enter</Button>
                </Col>
            </FormGroup>
            <ReactJson src={response} collapsed={true} />
        </Form>
    );
  }
}

export default MediaPost;
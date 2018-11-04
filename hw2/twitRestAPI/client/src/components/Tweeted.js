import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class Tweeted extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: '',
      text: '',
    };
  }

  callApi = async (message) => {
    console.log('send tweet...', message);
    axios.post('/tweeted', {
      message: message
    })
    .then((response) => {
      console.log(response);
      this.setState({response: response.data.reply, text: ''});
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
    return (
        <Form>
            <FormGroup row>
                <Label sm={2}>Tweet</Label>
                <Col sm={10}>
                    <Input onChange={e => this.onChange(e)} type="text" className="pull-right" placeholder="Enter a tweet here..." />
                    <Button onClick={() => this.handleBtnClick()} className="m-1 float-sm-right" id="twitter-btn">Tweet</Button>
                </Col>
            </FormGroup>
            <span>{this.state.response}</span>
        </Form>
    );
  }
}

export default Tweeted;

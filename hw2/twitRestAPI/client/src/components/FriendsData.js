import React, { Component, Fragment } from 'react';
import axios from 'axios';
import ReactJson from 'react-json-view'
import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class FriendsData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: {},
      text: '',
    };
  }

  callApi = async (id) => {
    axios.get(`/friendsData/${id}`)
      .then((response) => {
          console.log(response);
        this.setState({response: response});
      })
      .catch((e) => 
      {
        console.error(e);
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
                <Label sm={2}>Friend ID</Label>
                <Col sm={10}>
                    <Input onChange={e => this.onChange(e)} type="text" className="pull-right" placeholder="Search friend data for friend id..." />
                    <Button onClick={() => this.handleBtnClick()} className="m-1 float-sm-right" id="twitter-btn">Search</Button>
                </Col>
            </FormGroup>
            <ReactJson src={response} collapsed={true} />
        </Form>
    );
  }
}

export default FriendsData;
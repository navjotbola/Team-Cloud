import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class SearchedData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: [],
      text: '',
    };
  }

  callApi = async (user) => {
    axios.get(`/searchedData/${user}`)
      .then((response) => {
        this.setState({response: response.data.statuses});
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
    const displayResult = response.length ? response[0].created_at : 'No data to show for this user'
    return (
        <Form>
            <FormGroup row>
                <Label sm={2}>Username</Label>
                <Col sm={10}>
                    <Input onChange={e => this.onChange(e)} type="text" className="pull-right" placeholder="Search data for..." />
                    <Button onClick={() => this.handleBtnClick()} className="m-1 float-sm-right" id="twitter-btn">Tweet</Button>
                </Col>
            </FormGroup>
            <span>{displayResult}</span>
        </Form>
    );
  }
}

export default SearchedData;

// import React, { Component, Fragment } from 'react';
// import axios from 'axios';
// import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

// class SearchedData extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       response: '',
//       post: '',
//       responseToPost: '',
//     };
//   }

//   callApi = async () => {
//     // axios.get('/searchedData/4086146670')
//     axios.get('/searchedData/elonmusk')
//       .then((response) => {
//         this.setState({response: response.data.statuses});
//       })
//       .catch((e) => 
//       {
//         console.error(e);
//       });
    
//   };

//   render() {
//     console.log('calling render');
//     const { response } = this.state;
//     return (
//       <Form>
//         <FormGroup row>
//             <Label sm={2}>Username</Label>
//             <Col sm={10}>
//                 <Input onChange={e => this.onChange(e)} type="text" className="pull-right" placeholder="Search data for..." />
//                 <Button onClick={() => this.handleBtnClick()} className="m-1 float-sm-right" id="twitter-btn">Tweet</Button>
//             </Col>
//         </FormGroup>
//     </Form>
//       // <div>SearchedData: {response[0].created_at}</div>
//     );
//   }
// }

// export default SearchedData;


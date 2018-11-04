import React, { Component } from 'react';
import './App.css';
import SearchedData from './components/SearchedData';
import Tweeted from './components/Tweeted';
import { Button, Jumbotron } from 'reactstrap';
import { SEARCH_API, TWEETED_API, ANOTHER_API } from './constants';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      api: TWEETED_API,
    };
  }
  
  handleBtnClick(api) {
    this.setState({ api });
  }

  render() {
    const { api } = this.state;
    return (
      <div className="App">
        <div>
          APIs: 
          <Button onClick={() => this.handleBtnClick(TWEETED_API)} className="m-1" id="twitter-btn">tweeted</Button>
          <Button onClick={() => this.handleBtnClick(SEARCH_API)} className="m-1" id="twitter-btn">searchedData</Button>
          <Button onClick={() => this.handleBtnClick(ANOTHER_API)} className="m-1" id="twitter-btn">follwersData</Button>
          <Button onClick={() => this.handleBtnClick(ANOTHER_API)} className="m-1" id="twitter-btn">retweet</Button>
          <Button onClick={() => this.handleBtnClick(ANOTHER_API)} className="m-1" id="twitter-btn">destroyTweet</Button>
          <Button onClick={() => this.handleBtnClick(ANOTHER_API)} className="m-1" id="twitter-btn">slugData</Button>
          <Button onClick={() => this.handleBtnClick(ANOTHER_API)} className="m-1" id="twitter-btn">mediaPost</Button>
          <Button onClick={() => this.handleBtnClick(ANOTHER_API)} className="m-1" id="twitter-btn">friendsData</Button>
        </div>
        <Jumbotron>
          { api === TWEETED_API &&
            <Tweeted/>
          }
          { api === SEARCH_API &&
            <SearchedData/>
          }
        </Jumbotron>
      </div>
    );
  }
}

export default App;

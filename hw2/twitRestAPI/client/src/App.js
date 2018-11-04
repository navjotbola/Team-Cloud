import React, { Component } from 'react';
import './App.css';
import SearchedData from './components/SearchedData';
import Tweeted from './components/Tweeted';
import FollowersData from './components/FollowersData';
import Retweet from './components/Retweet';
import { Button, Jumbotron } from 'reactstrap';
import { SEARCH_API, TWEETED_API, FOLLOWERS_API, RETWEET_API, DESTORY_API, SLUG_API, MEDIA_API, FRIENDS_API } from './constants';
import DestroyTweet from './components/DestroyTweet';
import SlugData from './components/SlugData';
import MediaPost from './components/MediaPost';
import FriendsData from './components/FriendsData';

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
          <Button onClick={() => this.handleBtnClick(FOLLOWERS_API)} className="m-1" id="twitter-btn">follwersData</Button>
          <Button onClick={() => this.handleBtnClick(RETWEET_API)} className="m-1" id="twitter-btn">retweet</Button>
          <Button onClick={() => this.handleBtnClick(DESTORY_API)} className="m-1" id="twitter-btn">destroyTweet</Button>
          <Button onClick={() => this.handleBtnClick(SLUG_API)} className="m-1" id="twitter-btn">slugData</Button>
          <Button onClick={() => this.handleBtnClick(MEDIA_API)} className="m-1" id="twitter-btn">mediaPost</Button>
          <Button onClick={() => this.handleBtnClick(FRIENDS_API)} className="m-1" id="twitter-btn">friendsData</Button>
        </div>
        <Jumbotron>
          { api === TWEETED_API &&
            <Tweeted/>
          }
          { api === SEARCH_API &&
            <SearchedData/>
          }
          { api === FOLLOWERS_API &&
            <FollowersData/>
          }
          { api === RETWEET_API &&
            <Retweet/>
          }
          { api === DESTORY_API &&
            <DestroyTweet/>
          }
          { api === SLUG_API &&
            <SlugData/>
          }
          { api === MEDIA_API &&
            <MediaPost/>
          }
          { api === FRIENDS_API &&
            <FriendsData/>
          }
        </Jumbotron>
      </div>
    );
  }
}

export default App;

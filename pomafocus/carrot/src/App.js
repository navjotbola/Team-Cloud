import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { Auth } from "aws-amplify";
import config from "./config";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      isFedAuth: false,
      isAuthenticating: true,
      id: null
    };
  }

  async componentDidMount() {
    console.log('App.js componentDidMount')
    this.loadFacebookSDK();
    this.loadGoogleSDK();
    try {
        await Auth.currentAuthenticatedUser();
        this.userHasAuthenticated(true);
        const info = await Auth.currentAuthenticatedUser();
        console.log(info);
        const id = info ? info.id : null;
        this.setUserId(id);
        console.log('id', id);
        if (!id) {
          const test = await Auth.currentUserInfo();
          this.setUserId(test.id);
        }
    } catch (e) {
        if (e !== "not authenticated") {
        alert(e);
      }
    }
    this.setState({ isAuthenticating: false });
  }

  async componentWillReceiveProps() {
    try {
        await Auth.currentAuthenticatedUser();
        this.userHasAuthenticated(true);
        const info = await Auth.currentAuthenticatedUser();
        console.log(info);
        if(!info) {
          return;
        }
        const id = info ? info.id : null;
        this.setUserId(id);
        if (!id) {
          const test = await Auth.currentUserInfo();
          this.setUserId(test.id);
        }
    } catch (e) {
        if (e !== "not authenticated") {
        alert(e);
      }
    }
    this.setState({ isAuthenticating: false });
  }

  getUserInfo = (userId) => API.get("api", `/api/user/${userId}`).then(response => true).catch(error => false);

  // Creates the user in users table
  createUser(firstName, lastName, emailId) {
    return API.post("api", "/api/user", {
      body: {
        firstName,
        lastName,
        emailId,
        role: 'developer',
      }
    });
  }

  loadFacebookSDK() {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId            : config.social.FB,
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v3.1'
      });
      window.FB.AppEvents.logPageView();
    };

    (function(d, s, id){
       var js, gjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       gjs.parentNode.insertBefore(js, gjs);
     }(document, 'script', 'facebook-jssdk'));
  }

    loadGoogleSDK() {

    /*window.gapi.load('auth2', function() {
        window.gapi.auth2.init({
            client_id: config.social.GOOGLE,
            scope: 'profile email openid'
        });
    });*/

    window.gapi.load('client:auth2', function() {
      window.gapi.auth2.init({
        client_id: config.social.GOOGLE,
        scope: 'profile email https://www.googleapis.com/auth/calendar.readonly'
      });
      window.gapi.client.init({
        apiKey: config.social.CALAPPKEY,
        clientId: config.social.GOOGLE,
        discoveryDocs: "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        scope: "https://www.googleapis.com/auth/calendar.readonly"
      });
    });

  }

  userHasAuthenticated = async (authenticated) => {
    this.setState({
      isAuthenticated: authenticated,
    });
  }

  setupFedUserInfo = async (user) => {
    const { name, email } = user;
    const info = await Auth.currentAuthenticatedUser();
    const { id } = info;
    this.setUserId(id);
    // Fetch firstname
    var firstname = name.split(" ")[0];
    var lastname = name.split(" ")[1];
    console.log('setupFedUserInfo')
    if (id) {
      const userInfo = await this.getUserInfo(id);
      if (!userInfo) {
        console.log('create user');
        this.createUser(firstname, lastname, email)
      }
    }
  }

  setUserId = (id) => {
    this.setState({ id });
  }

  userHasFedAuthenticated = authenticated => {
    this.setState({ isFedAuth: authenticated });
  }

  handleLogout = async event => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
    window.location.reload();
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      isFedAuth: this.state.isFedAuth,
      userHasAuthenticated: this.userHasAuthenticated,
      setUserId: this.setUserId,
      setupFedUserInfo: this.setupFedUserInfo,
      userHasFedAuthenticated: this.userHasFedAuthenticated,
      id: this.state.id
    };

    return (
      !this.state.isAuthenticating &&
      <div className="App">
        <Navbar fluid collapseOnSelect fixedTop>
          <Navbar.Header>
              <Link to="/"><img src={process.env.PUBLIC_URL + '/pomafocusIcon.png'} alt="logo" />POMAFOCUS</Link>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {this.state.isAuthenticated
                ? <Fragment>
                    <LinkContainer to="/tasks" className="nav-btn">
                      <NavItem>Tasks</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/manage" className="nav-btn">
                      <NavItem>Manage</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/configure" className="nav-btn">
                      <NavItem>Configure</NavItem>
                    </LinkContainer>
                    <NavItem onClick={this.handleLogout}>Logout</NavItem>
                  </Fragment>
                : <Fragment>
                    <LinkContainer to="/signup" className="nav-btn">
                      <NavItem>Signup</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <NavItem className="nav-btn">Login</NavItem>
                    </LinkContainer>
                </Fragment>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
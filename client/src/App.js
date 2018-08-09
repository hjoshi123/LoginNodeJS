import React, { Component } from "react";
import "./App.css";
import ProfileCard from "./components/ProfileCard";
import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";

var IN = null;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthorized: false,
      firstName: null,
      lastName: null,
      headline: null,
      profileURL: null,
      pictureURL: null,
      location: null,
      positions: null,
      summary: null,
      connectionsCount: null,
    };
  }
  isLinkedinAuthorized = () => {
    return IN.User.isAuthorized();
  };

  linkedinAuthorize = () => {
    IN.User.authorize(this.onLinedInLoad());
  };

  updateAuthorizeStatus = () => {
    if (IN === null) {
      IN = window.IN;
    }
    if (this.isLinkedinAuthorized()) {
      this.setState({
        isAuthorized: true
      });
      this.requestLinkedinProfile();
    }
  };

  onLinedInLoad = () => {
    IN.Event.on(IN, "auth", this.updateAuthorizeStatus);
  };

  linkedinLogout = () => {
    IN.User.logout(this.updateAuthorizeStatus);
  };

  componentDidMount = () => {
    console.log("Helo");
    this.loadLinkedinJS();
  };

  loadLinkedinJS = () => {
    console.log('ho');
    window.updateAuthorizeStatus = this.updateAuthorizeStatus;
    var script = window.document.createElement("script");
    script.src = "//platform.linkedin.com/in.js";
    script.innerHTML = `api_key:   81546j5keb6ssd
    authorize: true
    onLoad:updateAuthorizeStatus`;
    script.async = true;
    document.getElementsByTagName("head")[0].appendChild(script);
  };

  requestLinkedinProfile = () => {
    IN.API.Raw(
      "/people/~:(first-name,last-name,public-profile-url,location,headline,picture-url,positions,summary,num-connections)?format=json"
    )
      .method("GET")
      .body()
      .result(this.updateLinkedinProfile);
  };

  updateLinkedinProfile = profile => {
    console.log(profile)
    this.setState({
      firstName: profile.firstName,
      headline: profile.headline,
      lastName: profile.lastName,
      profileURL: profile.publicProfileUrl,
      pictureURL: profile.pictureUrl,
      location: profile.location.name,
      positions: profile.positions,
      summary: profile.summary,
      connectionsCount: profile.numConnections
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Linkedin Login</h1>
          <p className="App-intro">A demo page for Linkedin login</p>
          <a
            href="https://github.com/hjoshi123/LoginNodeJS/tree/linkedin"
            className="github-link"
          >
            hjoshi123/LoginNodeJS/LinkedInLogin
          </a>
          <Alert />
        </header>
        <div className="App-body">
          {this.state.isAuthorized ? (
            <span>
              <button className="btn btn-warning" onClick={this.linkedinLogout}>Linkedin Logout</button>
            </span>
          ) : (
            <img src="linkedin.png" className="img-responsive center-block" onClick={this.linkedinAuthorize} />
          )}
          {this.state.isAuthorized &&
            (
              <ProfileCard
                firstName={this.state.firstName}
                headline={this.state.headline}
                lastName={this.state.lastName}
                profileURL={this.state.profileURL}
                pictureURL={this.state.pictureURL}
                location={this.state.location}
                positions={this.state.positions}
                summary={this.state.summary}
                connectionsCount={this.state.connectionsCount}
              />
            )}
        </div>
      </div>
    );
  }
}

export default App;
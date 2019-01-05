import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: null
    };
  }

  componentDidMount() {
    if (window.location.search) {
      let accessToken = window.location.search.replace("?access_token=", "");
      this.setState({ accessToken });
      if (accessToken) {
        axios
          .post("http://localhost:8000/login", {
            access_token: accessToken
          })
          .then(response => {
            console.log(response);
          })
          .catch(e => console.log(e));
      }
    }
  }

  render() {
    return (
      <div className="App">
        <a
          href={`https://oauth.groupme.com/oauth/authorize?client_id=3OwX3c4j3w7hJJpF3KC2YepqfoKz91Y4WI9zoXY5ZCT08iHq`}
        >
          Click to get started
        </a>
      </div>
    );
  }
}

export default App;

import React, { Component } from "react";
import axios from "axios";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: null,
      movies: []
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
      <div>
        {this.state.movies.map((movie, i) => {
          return <div key={i}>hey</div>;
        })}
      </div>
    );
  }
}

export default User;

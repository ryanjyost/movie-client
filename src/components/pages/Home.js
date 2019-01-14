import React, { Component } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import moment from "moment";
import { Button, FormGroup, FormControl } from "react-bootstrap";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      user: null,
      movies: [],
      votes: {},
      moviesBeingEdited: {},
      savingVote: false,
      isStranger: false
    };
  }

  componentDidMount() {
    if (window.location.search) {
      let accessToken = window.location.search.replace("?access_token=", "");

      axios
        .post("https://predict-movies-prod.herokuapp.com/users/login", {
          access_token: accessToken
        })
        .then(response => {
          this.props.updateUser(response.data.user, !response.data.isMember);
          this.setState({
            votes: response.data.user.votes || {}
          });
        })
        .catch(e => console.log(e));
    }
  }

  render() {
    const renderLanding = () => {
      const devURL =
        "https://oauth.groupme.com/oauth/authorize?client_id=C9Quth8nYeYdwrokegBdnJvURAGTnfLSSHJxSUVQ0W0OBLAX";
      const url =
        "https://oauth.groupme.com/oauth/authorize?client_id=m35GLCvXufGcG7vL8243ZXNaZ8hGs9QcUoIFiNFSmeXRw3Ba";
      return (
        <div
          style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
          }}
        >
          <h1>Movie Medium</h1>
          <p>
            Predict{" "}
            <a target={"_blank"} href="https://www.rottentomatoes.com/">
              Rotten Tomatoes
            </a>{" "}
            scores with friends.
          </p>
          <a
            style={{
              margin: "20px 0px 0px 0px",
              backgroundColor: "#00aff0",
              color: "#fff",
              fontWeight: "bold",
              padding: "10px 20px",
              textDecoration: "none",
              borderRadius: 3
            }}
            className={"homeButton"}
            href={url}
          >
            Sign in with GroupMe
          </a>
        </div>
      );
    };

    return renderLanding();
  }
}

export default Home;

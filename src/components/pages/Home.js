import React, { Component } from "react";
import axios from "axios";
import withStyles from "../../lib/withStyles";

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
        .post(
          `${process.env.REACT_APP_API_URL ||
            "https://predict-movies-prod.herokuapp.com"}/users/login`,
          {
            access_token: accessToken
          }
        )
        .then(response => {
          console.log("HEY!!!!!", response.data.user, accessToken);
          this.props.updateUser(
            { ...response.data.user, ...{ accessToken } },
            !response.data.isMember
          );
          this.setState({
            votes: response.data.user.votes || {}
          });
        })
        .catch(e => console.log(e));
    }
  }

  render() {
    const { styles } = this.props;

    const renderLanding = () => {
      const url =
        "https://oauth.groupme.com/oauth/authorize?client_id=m35GLCvXufGcG7vL8243ZXNaZ8hGs9QcUoIFiNFSmeXRw3Ba";
      return (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            backgroundColor: "#FA320A",
            padding: "0px 0px 20px 0px",
            overflow: "hidden",
            boxSizing: "border-box"
          }}
        >
          <div
            className={"topBar"}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 20
            }}
          >
            <div
              style={{
                color: styles.white(),
                fontWeight: "bold",
                fontSize: 20
              }}
            >
              Movie Medium
            </div>
            <a
              style={{
                margin: "0px 0px 0px 0px",
                backgroundColor: "#fff",
                color: styles.red(),
                fontWeight: "bold",
                padding: "4px 10px",
                textDecoration: "none",
                borderRadius: 3
              }}
              href={process.env.REACT_APP_GROUPME_AUTH || url}
            >
              Sign in
            </a>
          </div>

          <div className="main">
            <div id={"left"}>
              <h2 style={{ color: styles.white(0.95), fontWeight: "bold" }}>
                Predict{" "}
                <a
                  target={"_blank"}
                  href="https://www.rottentomatoes.com/"
                  style={{ color: "#fff" }}
                >
                  Rotten Tomatoes
                </a>
                <br />
                scores with friends
              </h2>
              <a
                style={{
                  margin: "20px 0px 0px 0px",
                  backgroundColor: "#fff",
                  color: styles.red(1),
                  fontWeight: "bold",
                  padding: "10px 20px",
                  textDecoration: "none",
                  borderRadius: 3,
                  fontSize: 16
                }}
                className={"homeButton"}
                href={process.env.REACT_APP_GROUPME_AUTH || url}
              >
                Start playing in GroupMe
              </a>
            </div>

            <div id={"right"}>
              <div className="marvel-device iphone8 silver">
                <div className="top-bar" />
                <div className="sleep" />
                <div className="volume" />
                <div className="camera" />
                {/*<div className="sensor" />*/}
                <div className="speaker" />
                <div className="screen">
                  <img src="preview.jpeg" width="100%" />
                </div>
                <div className="home" />
                <div className="bottom-bar" />
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div>
        {renderLanding()}
        <div style={{ backgroundColor: styles.black(0.02), height: "100vh" }}>
          hey
        </div>
      </div>
    );
  }
}

export default withStyles(Home);

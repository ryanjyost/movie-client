import React, { Component } from "react";
import axios from "axios";
import withStyles from "../../lib/withStyles";
import { Link } from "react-router-dom";

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
          this.props.updateUser({ ...response.data.user, ...{ accessToken } });
          this.setState({
            votes: response.data.user.votes || {}
          });
        })
        .catch(e => console.log(e));
    }
  }

  render() {
    const { styles, user } = this.props;

    const renderLanding = () => {
      const url =
        "https://oauth.groupme.com/oauth/authorize?client_id=m35GLCvXufGcG7vL8243ZXNaZ8hGs9QcUoIFiNFSmeXRw3Ba";

      const signInBtnStyle = {
        margin: "0px 0px 0px 0px",
        backgroundColor: styles.white(0.4),
        color: "#fff",
        fontWeight: "bold",
        padding: "4px 10px",
        textDecoration: "none",
        borderRadius: 3
      };

      return (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            backgroundColor: styles.primary(),
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
            {user && user.groups.length ? (
              <Link
                to={"/upcoming"}
                style={signInBtnStyle}
                className={"hoverBtn"}
              >
                Sign In
              </Link>
            ) : (
              <a
                style={signInBtnStyle}
                className={"hoverBtn"}
                href={process.env.REACT_APP_GROUPME_AUTH || url}
              >
                Sign in
              </a>
            )}
          </div>

          <div className="main">
            <div id={"left"}>
              <h2
                style={{
                  color: styles.white(0.9),
                  fontWeight: "bold",
                  fontSize: styles.isWide ? 36 : 26
                }}
              >
                Predict{" "}
                <a
                  target={"_blank"}
                  href="https://www.rottentomatoes.com/"
                  style={{ color: "#fff" }}
                >
                  Rotten Tomatoes
                </a>
                <br />
                scores against your friends
              </h2>
              <a
                style={{
                  margin: "20px 0px 0px 0px",
                  backgroundColor: styles.secondary(),
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "8px 40px",
                  textDecoration: "none",
                  borderRadius: 3,
                  fontSize: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                className={"hoverBtn"}
                href={process.env.REACT_APP_GROUPME_AUTH || url}
              >
                Start Playing
                {/*<span style={{ marginLeft: 10, fontSize: 20 }}>&rarr;</span>*/}
              </a>
              <div
                style={{
                  textAlign: "center",
                  paddingTop: 20,
                  color: styles.white(0.5)
                }}
              >
                Not endorsed by{" "}
                <a
                  style={{ color: styles.white(0.5) }}
                  href="https://www.rottentomatoes.com/"
                >
                  Rotten Tomatoes®
                </a>
              </div>
            </div>

            <div id={"right"}>
              <div className="marvel-device iphone8 silver">
                <div className="top-bar" />
                <div className="sleep" />
                <div className="volume" />
                <div className="camera" />
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

    const btnStyle = {
      color: styles.white(0.7),
      margin: "5px 20px"
    };

    return (
      <div>
        {renderLanding()}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: styles.primary(),
            padding: "50px 20px"
          }}
        >
          <Link to={"/terms"} style={btnStyle}>
            Terms of Service
          </Link>
          <Link to={"/privacy"} style={btnStyle}>
            Privacy Policy
          </Link>
          <a
            href={"mailto:ryanjyost@gmail.com"}
            style={btnStyle}
            target={"_blank"}
          >
            Contact Me
          </a>
        </div>
      </div>
    );
  }
}

export default withStyles(Home);

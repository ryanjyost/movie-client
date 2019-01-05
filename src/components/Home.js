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
          this.setState({
            user: response.data.user,
            votes: response.data.user.votes || {},
            isStranger: !response.data.isMember
          });

          if (response.data.isMember) {
            window.localStorage.setItem("userId", response.data.user._id);
          }
        })
        .catch(e => console.log(e));
    } else if (window.localStorage.getItem("userId")) {
      // get prev auth user
      let userId = window.localStorage.getItem("userId");
      axios
        .post(`https://predict-movies-prod.herokuapp.com/users/${userId}`)
        .then(response => {
          window.localStorage.setItem("userId", response.data.user._id);
          this.setState({
            user: response.data.user,
            votes: response.data.user.votes || {}
          });
        })
        .catch(e => console.log(e));
    } else {
      window.localStorage.setItem("userId", "");
    }

    axios
      .get("https://predict-movies-prod.herokuapp.com/movies")
      .then(response => {
        console.log(response.data);
        this.setState({ movies: response.data.movies });
      })
      .catch(e => console.log(e));

    // axios
    //   .get("https://predict-movies-prod.herokuapp.com/groupme/users")
    //   .then(response => {
    //     console.log(response.data);
    //     this.setState({ movies: response.data.movies });
    //   })
    //   .catch(e => console.log(e));
  }

  updateVoteInput(value, movieId) {
    console.log(value, movieId);
    let moviesBeingEdited = { ...this.state.moviesBeingEdited };
    if (value > 100) {
      moviesBeingEdited[movieId] = 100;
    } else if (value < 0) {
      moviesBeingEdited[movieId] = 0;
    } else {
      moviesBeingEdited[movieId] = value;
    }

    this.setState({ moviesBeingEdited });
  }

  setAsBeingEdited(movieId) {
    console.log(movieId);
    let moviesBeingEdited = { ...this.state.moviesBeingEdited };
    moviesBeingEdited[movieId] =
      this.state.votes[movieId] > -1 ? this.state.votes[movieId] : 50;
    this.setState({ moviesBeingEdited });
  }

  saveVote(movieId) {
    let moviesBeingEdited = { ...this.state.moviesBeingEdited };

    axios
      .post(
        `https://predict-movies-prod.herokuapp.com/movies/predict/${movieId}`,
        {
          userId: this.state.user._id,
          prediction: this.state.moviesBeingEdited[movieId]
        }
      )
      .then(response => {
        delete moviesBeingEdited[movieId];
        this.setState({
          user: response.data.user,
          votes: response.data.user.votes,
          moviesBeingEdited,
          savingVote: false
        });
      })
      .catch(e => {
        this.setState({ savingVote: false, moviesBeingEdited: {} });
        console.log(e);
      });
  }

  youtube_parser(url) {
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return match && match[1].length == 11 ? match[1] : false;
  }

  render() {
    const renderUser = () => {
      const renderVideo = video => {
        const opts = {
          height: 350 * (390 / 640),
          width: 350
        };

        return <YouTube videoId={video} opts={opts} />;
      };

      const renderInput = movie => {
        const vote = Number(this.state.moviesBeingEdited[movie._id]);
        const hasVote = this.state.votes[movie._id] > -1;
        const noMoreVoting = moment().isAfter(moment(movie.releaseDate * 1000));
        const { savingVote } = this.state;
        const isBeingEdited = this.state.moviesBeingEdited[movie._id] > -1;
        const isValidVote = vote > -1 && vote < 101;

        if (isBeingEdited && !noMoreVoting) {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                // justifyContent: "center",
                width: "100%",
                color: "rgba(0,0,0,0.9)",
                marginBottom: 20
              }}
            >
              <FormGroup bsSize="large" style={{ width: 80, marginBottom: 0 }}>
                <FormControl
                  onChange={e => {
                    if (!savingVote) {
                      this.updateVoteInput(e.target.value, movie._id);
                    }
                  }}
                  readOnly={savingVote}
                  value={vote}
                  style={{ fontWeight: "bold" }}
                  type="number"
                  placeholder=""
                  min="0"
                  max="100"
                />
              </FormGroup>

              <div style={{ fontSize: 20, marginLeft: 5 }}>%</div>
              <Button
                bsStyle={"success"}
                disabled={!isValidVote || savingVote}
                bsSize={"small"}
                style={{
                  marginLeft: 20,
                  display: "flex",
                  alignItems: "center"
                }}
                onClick={() => {
                  this.setState({ savingVote: true });
                  this.saveVote(movie._id);
                }}
              >
                {savingVote ? (
                  <span style={{ marginRight: 3 }}>⏳</span>
                ) : (
                  <span style={{ marginRight: 3 }}>👍</span>
                )}
                {savingVote ? "Saving..." : "Save your prediction"}
              </Button>
            </div>
          );
        } else {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                // justifyContent: "center",
                width: "100%",
                color: "rgba(0,0,0,0.9)",
                marginBottom: 10
              }}
            >
              {hasVote ? (
                <div style={{ fontSize: 26, fontWeight: "bold" }}>{`${
                  this.state.votes[movie._id]
                }%`}</div>
              ) : null}

              {!noMoreVoting && (
                <Button
                  bsStyle={"default"}
                  disabled={false}
                  bsSize={"small"}
                  onClick={() => this.setAsBeingEdited(movie._id)}
                  style={{
                    marginLeft: hasVote ? 20 : 0,
                    display: "flex",
                    alignItems: "center",
                    color: !hasVote ? "#fff" : null,
                    fontWeight: "bold",
                    backgroundColor: !hasVote ? "#FA320A" : null
                  }}
                >
                  {!hasVote ? (
                    <span style={{ marginRight: 3 }}>🍿</span>
                  ) : (
                    <span style={{ marginRight: 3 }}>👈</span>
                  )}
                  {!hasVote ? "Make your prediction" : "Edit your prediction"}
                </Button>
              )}
            </div>
          );
        }
      };
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            padding: "50px 20px"
          }}
        >
          {this.state.movies.map((movie, i) => {
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {renderVideo(this.youtube_parser(movie.trailer))}
                <div
                  style={{
                    width: "100%",
                    maxWidth: 500,
                    display: "block",
                    padding: "10px 20px",
                    color: "rgba(0,0,0,0.7)"
                  }}
                >
                  {renderInput(movie)}
                  <h4 style={{ padding: "0px 0px", marginBottom: "5px" }}>
                    {movie.title}
                  </h4>
                  <h6 style={{ margin: "0px 0px 5px 0px" }}>
                    Release Date:{" "}
                    {moment(movie.releaseDate * 1000).format("MMMM DD, YYYY")}
                  </h6>
                  <p>{movie.summary}</p>
                  <div>
                    <a href={movie.rtLink} target={"_blank"}>
                      View on Rotten Tomatoes
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    };

    if (this.state.isStranger) {
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
          <h4>
            Looks like you're not a member of Movie Medium's experimental
            GroupMe chat.
          </h4>
          <p>
            If you think that's a mistake or are interested in joining Movie
            Medium, email me at ryanjyost@gmail.com
          </p>
          {/*<a*/}
          {/*style={{*/}
          {/*margin: "20px 0px 0px 0px",*/}
          {/*backgroundColor: "#00aff0",*/}
          {/*color: "#fff",*/}
          {/*fontWeight: "bold",*/}
          {/*padding: "10px 20px",*/}
          {/*textDecoration: "none",*/}
          {/*borderRadius: 3*/}
          {/*}}*/}
          {/*className={"homeButton"}*/}
          {/*href={`https://oauth.groupme.com/oauth/authorize?client_id=3OwX3c4j3w7hJJpF3KC2YepqfoKz91Y4WI9zoXY5ZCT08iHq`}*/}
          {/*>*/}
          {/*Sign in with GroupMe*/}
          {/*</a>*/}
        </div>
      );
    } else if (this.state.user) {
      return renderUser();
    }
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
          href={`https://oauth.groupme.com/oauth/authorize?client_id=m35GLCvXufGcG7vL8243ZXNaZ8hGs9QcUoIFiNFSmeXRw3Ba`}
        >
          Sign in with GroupMe
        </a>
      </div>
    );
  }
}

export default Home;

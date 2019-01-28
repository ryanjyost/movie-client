import React, { Component } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import moment from "moment";
import { Button, FormGroup, FormControl } from "react-bootstrap";

class Upcoming extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      // votes: {},
      moviesBeingEdited: {},
      savingVote: false
    };
  }

  componentDidMount() {
    axios
      .get(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/movies`,
        {
          params: { isClosed: 0, rtScore: -1 }
        }
      )
      .then(response => {
        const sorted = response.data.movies.sort((a, b) => {
          if (a.releaseDate > b.releaseDate) {
            return 1;
          } else if (a.releaseDate < b.releaseDate) {
            return -1;
          } else {
            return 0;
          }
        });
        this.setState({
          movies: sorted
          // votes: this.props.user.votes
        });
      })
      .catch(e => console.log(e));

    // axios
    //   .get("http://localhost:8000/groupme/users")
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
    let moviesBeingEdited = { ...this.state.moviesBeingEdited };
    moviesBeingEdited[movieId] = this.props.user.votes
      ? this.props.user.votes[movieId] > -1
        ? this.props.user.votes[movieId]
        : 50
      : 50;
    this.setState({ moviesBeingEdited });
  }

  saveVote(movieId) {
    let moviesBeingEdited = { ...this.state.moviesBeingEdited };

    axios
      .post(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/movies/predict/${movieId}`,
        {
          userId: this.props.user._id,
          prediction: this.state.moviesBeingEdited[movieId]
        }
      )
      .then(response => {
        delete moviesBeingEdited[movieId];
        this.props.updateUser(response.data.user);
        this.setState({
          // votes: response.data.user.votes,
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
        const hasVote = this.props.user.votes
          ? this.props.user.votes[movie._id] > -1
          : false;
        const noMoreVoting = moment().isAfter(moment(movie.releaseDate * 1000));
        const { savingVote } = this.state;
        const isBeingEdited = this.state.moviesBeingEdited[movie._id] > -1;
        const isValidVote = vote > -1 && vote < 101;

        if (isBeingEdited) {
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
                  this.props.user.votes[movie._id]
                }%`}</div>
              ) : null}

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
            padding: "30px 20px"
          }}
        >
          <h5 style={{ textAlign: "center", fontWeight: "bold" }}>
            Predict the Rotten Tomatoes Scores for these upcoming movies.
          </h5>
          <h5 style={{ margin: "10px 0px 40px 0px" }}>&darr;</h5>
          {this.state.movies.map((movie, i) => {
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 50
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

    return renderUser();
  }
}

export default Upcoming;

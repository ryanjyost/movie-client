import React, { Component } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import moment from "moment";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import Movie from "../Movie";

class Upcoming extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      // votes: {},
      moviesBeingEdited: {},
      savingVote: false,
      moviePredictionCutoffDate: null
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
          movies: sorted,
          moviePredictionCutoffDate: response.data.moviePredictionCutoffDate
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
    const { styles, user } = this.props;

    const moviesThatNeedPrediction = this.props.user
      ? this.state.movies.filter(movie => {
          return !(movie._id in user.votes);
        })
      : [];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 500,
          padding: "120px 0px",
          margin: "auto"
        }}
      >
        {moviesThatNeedPrediction.length ? (
          <h4
            style={{
              marginBottom: 10,
              color: styles.secondary(),
              fontWeight: "bold"
            }}
          >{`${moviesThatNeedPrediction.length} ${
            moviesThatNeedPrediction.length === 1 ? "movie" : "movies"
          } ${
            moviesThatNeedPrediction.length === 1 ? "needs" : "need"
          } your prediction! `}</h4>
        ) : null}
        <h5
          style={{
            textAlign: "center",
            // fontWeight: "bold",
            color: styles.primary(0.7)
          }}
        >
          Predict the Rotten Tomatoes Scores of upcoming movies
        </h5>
        <h5 style={{ margin: "10px 0px 20px 0px", color: styles.primary(0.4) }}>
          &darr;
        </h5>
        {this.state.movies.map((movie, i) => {
          return (
            <Movie
              isUpcoming
              showTrailer
              allowEdit
              fetchGroup
              key={i}
              user={this.props.user}
              movie={movie}
              styles={styles}
              updateUser={this.props.updateUser}
              moviePredictionCutoffDate={this.state.moviePredictionCutoffDate}
            />
          );
        })}
      </div>
    );
  }
}

export default Upcoming;

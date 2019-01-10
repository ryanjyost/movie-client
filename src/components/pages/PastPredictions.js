import React, { Component } from "react";
import axios from "axios";
import MovieTable from "../MovieTable";

class PastPredictions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: []
    };
  }

  componentDidMount() {
    axios
      .get(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/movies`,
        {
          params: { isClosed: 1, rtScore: 0 }
        }
      )
      .then(response => {
        const sorted = response.data.movies.sort((a, b) => {
          if (a.releaseDate > b.releaseDate) {
            return -1;
          } else if (a.releaseDate < b.releaseDate) {
            return 1;
          } else {
            return 0;
          }
        });
        this.setState({
          movies: sorted
        });
      })
      .catch(e => console.log(e));
  }

  render() {
    const { user } = this.props;
    const renderAvg = () => {
      let total = 0,
        numMovies = 0;

      for (let vote in user.votes) {
        let movie = this.state.movies.find(movie => movie._id === vote);
        if (movie) {
          numMovies++;
          let diff = movie.rtScore - user.votes[vote];
          total = total + Math.abs(diff);
        }
      }

      if (!total) {
        return null;
      } else {
        return (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <h5
              style={{ opacity: 0.8 }}
            >{`On average, your ${numMovies} prediction${
              numMovies === 1 ? "" : "s"
            } ${numMovies === 1 ? "is" : "are"}`}</h5>
            <h2
              style={{
                margin: "10px 0px",
                display: "flex",
                alignItems: "center"
              }}
            >
              <strong>{total / numMovies}</strong>
              <span
                style={{
                  color: "rgba(0, 0, 0, 0.4)",
                  paddingLeft: 2,
                  fontSize: 18
                }}
              >
                %
              </span>
            </h2>
            <h5 style={{ opacity: 0.8 }}>
              off from the actual{" "}
              <a target={"_blank"} href="https://www.rottentomatoes.com/about">
                Rotten Tomatoes Score
              </a>.
            </h5>
          </div>
        );
      }
    };

    return (
      <div
        style={{
          margin: "auto",
          width: "100%",
          maxWidth: 700,
          padding: "30px 10px"
        }}
      >
        {renderAvg()}
        <MovieTable movies={this.state.movies} user={this.props.user} />
      </div>
    );
  }
}

export default PastPredictions;

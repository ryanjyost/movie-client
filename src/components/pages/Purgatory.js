import React, { Component } from "react";
import axios from "axios";
import MovieTable from "../MovieTable";

class Purgatory extends Component {
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
          params: { isClosed: 1, rtScore: -1 }
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
        });
      })
      .catch(e => console.log(e));
  }

  render() {
    return (
      <div
        style={{
          margin: "auto",
          width: "100%",
          maxWidth: 700,
          padding: "30px 10px"
        }}
      >
        <h5 style={{ textAlign: "center" }}>
          These movies don't have a Rotten Tomatoes Score yet, but are close to
          the release date and closed to any more predictions.{" "}
          <strong>See your locked-in predictions below.</strong>{" "}
        </h5>
        <MovieTable movies={this.state.movies} user={this.props.user} />
      </div>
    );
  }
}

export default Purgatory;

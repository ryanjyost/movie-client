import React, { Component } from "react";
import axios from "axios";

class Join extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    axios
      .get(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/groupme/users`
      )
      .then(response => {
        console.log(response.data);
        this.setState({ movies: response.data.movies });
      })
      .catch(e => console.log(e));
  }

  render() {
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
          href={`https://oauth.groupme.com/oauth/authorize?client_id=3OwX3c4j3w7hJJpF3KC2YepqfoKz91Y4WI9zoXY5ZCT08iHq`}
        >
          Click to join via GroupMe
        </a>
        <div>Here are folks already playing in this group</div>
      </div>
    );
  }
}

export default Join;

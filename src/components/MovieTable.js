import React from "react";
import moment from "moment/moment";

const MovieTable = ({ movies, user }) => {
  const renderScores = movie => {
    return (
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "#fff"
          }}
        >
          <h6 style={{ color: "rgba(255, 255, 255, 0.6)" }}>your prediction</h6>
          <h4 style={{ margin: "0px 10px 0px 10px", fontWeight: "bold" }}>
            {user.votes[movie._id]}
            <span
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                paddingLeft: 2,
                fontSize: 13
              }}
            >
              %
            </span>
          </h4>
          <h6 style={{ color: "rgba(255, 255, 255, 0.8)" }}>vs.</h6>
          <h4 style={{ margin: "0px 10px 0px 10px", fontWeight: "bold" }}>
            {movie.rtScore}
            <span
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                paddingLeft: 2,
                fontSize: 13
              }}
            >
              %
            </span>
          </h4>
          <h6 style={{ color: "rgba(255, 255, 255, 0.6)" }}>actual score</h6>
        </div>
      </div>
    );
  };

  const renderPrediction = movie => {
    if (!user.votes || !user.votes[movie._id]) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <h4 style={{ marginRight: 10, opacity: 0.6 }}>
            You didn't predict this movie
          </h4>
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <h4 style={{ marginRight: 10, opacity: 0.6 }}>Your prediction is</h4>
          <h3 style={{ fontWeight: "bold" }}>{user.votes[movie._id]}%</h3>
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
        justifyContent: "center"
      }}
    >
      {movies.map(movie => {
        return (
          <div
            key={movie._id}
            style={{
              width: "100%",
              margin: "20px 0px",
              border: "1px solid #d8d8d8",
              borderRadius: 5,
              padding: "0px 0px 10px 0px",
              maxWidth: 500
            }}
          >
            <div
              style={{
                backgroundColor: "#337ab7",
                padding: "10px",
                color: "#fff"
              }}
            >
              {movie.rtScore >= 0
                ? renderScores(movie)
                : renderPrediction(movie)}
            </div>
            <div
              style={{
                width: "100%",
                padding: "20px 20px 10px 20px"
              }}
            >
              <h4 style={{ padding: "0px 0px", marginBottom: "5px" }}>
                {movie.title}
              </h4>
              <h6 style={{ margin: "0px 0px 5px 0px" }}>
                Release Date:{" "}
                {moment(movie.releaseDate * 1000).format("MMMM DD, YYYY")}
              </h6>
              <p>{movie.summary}</p>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <a
                  href={movie.rtLink}
                  target={"_blank"}
                  style={{ margin: "2px 15px 2px 0px" }}
                >
                  <span style={{ marginRight: 0 }}>🍿</span>View on Rotten
                  Tomatoes
                </a>
                <a
                  href={movie.trailer}
                  target={"_blank"}
                  style={{ margin: "2px 10px 2px 0px" }}
                >
                  <span style={{ marginRight: 0 }}>📺</span>Watch Trailer on
                  YouTube
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MovieTable;

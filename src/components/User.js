import React, { Component } from "react";
import YouTube from "react-youtube";
import moment from "moment";
import { Button, FormGroup, FormControl } from "react-bootstrap";

const User = () => {
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

export default User;

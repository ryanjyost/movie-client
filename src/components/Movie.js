import React, { Component } from "react";
import moment from "moment/moment";
import YouTube from "react-youtube";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import axios from "axios/index";
import { sortArrayByProperty } from "../lib/helpers";
import { Line } from "rc-progress";

export default class Movie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beingEdited: null,
      savingVote: false,
      vote: 50,
      videoReady: false
    };
  }

  componentDidMount() {
    // axios
    //   .get("http://localhost:8000/groupme/users")
    //   .then(response => {
    //     console.log(response.data);
    //     this.setState({ movies: response.data.movies });
    //   })
    //   .catch(e => console.log(e));
  }

  youtube_parser(url) {
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return match && match[1].length == 11 ? match[1] : false;
  }

  updateVoteInput(value, movieId) {
    let vote = 50;
    if (value > 100) {
      vote = 100;
    } else if (value < 0) {
      vote = 0;
    } else {
      vote = value;
    }

    this.setState({ vote });
  }

  setAsBeingEdited(movieId) {
    let vote = this.state.vote;
    vote = this.props.user.votes
      ? this.props.user.votes[movieId] > -1
        ? this.props.user.votes[movieId]
        : 50
      : 50;
    this.setState({
      vote: vote,
      beingEdited: true
    });
  }

  saveVote(movieId) {
    axios
      .post(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/movies/predict/${movieId}`,
        {
          userId: this.props.user._id,
          prediction: this.state.vote
        }
      )
      .then(response => {
        this.props.updateUser(response.data.user);
        this.setState({
          // votes: response.data.user.votes,
          beingEdited: false,
          savingVote: false
        });
      })
      .catch(e => {
        this.setState({ savingVote: false, beingEdited: false });
        console.log(e);
      });
  }

  generateReleaseText(releaseDateUnix) {
    const daysUntilCutoff = moment
      .unix(releaseDateUnix)
      .diff(moment.unix(this.props.moviePredictionCutoffDate), "days");

    if (daysUntilCutoff > 0) {
      return `${daysUntilCutoff} day${daysUntilCutoff === 1 ? "" : "s"}`;
    }

    const hoursUntilCutoff = moment()
      .endOf("day")
      .diff(moment(), "hours");

    if (hoursUntilCutoff > 0) {
      return `${hoursUntilCutoff} hour${hoursUntilCutoff === 1 ? "" : "s"}`;
    }

    return `< 1 hour!`;
  }

  render() {
    const {
      movie,
      styles,
      showTrailer,
      allowEdit,
      isUpcoming,
      user,
      moviePredictionCutOffDate,
      isPurgatory,
      isPast
    } = this.props;
    const { videoReady } = this.state;

    const releaseCountdownText = this.generateReleaseText(movie.releaseDate);

    const renderVideo = video => {
      const width = Math.min(styles.windowWidth, 500);
      const opts = {
        height: width * (390 / 640),
        width: width
      };

      return (
        <div
          style={{
            height: width * (390 / 640),
            width: width,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}
        >
          <YouTube
            videoId={typeof video === "string" ? video : ""}
            opts={opts}
            onReady={() => {
              this.setState({ videoReady: true });
            }}
          />

          {!videoReady && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
                width: "100%",
                height: "100%",
                backgroundColor: styles.primary(0.1),
                position: "absolute",
                top: 0
              }}
            >
              <div style={{ fontSize: 20 }}>🎬</div>
            </div>
          )}
        </div>
      );
    };

    const renderInput = movie => {
      const vote = this.state.vote === "" ? "" : Number(this.state.vote);
      const hasVote = this.props.user.votes
        ? this.props.user.votes[movie._id] > -1
        : false;
      const { savingVote } = this.state;
      const isBeingEdited = this.state.beingEdited;
      const isValidVote = !isNaN(vote) && vote > -1 && vote < 101;

      if (isBeingEdited) {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              color: "rgba(0,0,0,0.9)"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center"
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
                />
              </FormGroup>
              <div style={{ fontSize: 20, marginLeft: 5 }}>%</div>
            </div>

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
              justifyContent: "space-between",
              width: "100%",
              color: "rgba(0,0,0,0.9)"
            }}
          >
            {hasVote ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: styles.primary()
                }}
              >
                <div style={{ fontSize: 26, fontWeight: "bold" }}>{`${
                  this.props.user.votes[movie._id]
                }%`}</div>
                <h6 style={{ marginLeft: 6, opacity: 0.75 }}>prediction</h6>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: "bold",
                    color: styles.secondary()
                  }}
                >{`${releaseCountdownText.split(" ")[0]}`}</div>
                <h6 style={{ marginLeft: 6, color: styles.secondary(0.75) }}>
                  {releaseCountdownText.split(" ")[1]} left to predict
                </h6>
              </div>
            )}

            <Button
              bsStyle={"default"}
              disabled={false}
              bsSize={"small"}
              className={"hoverBtn"}
              onClick={() => this.setAsBeingEdited(movie._id)}
              style={{
                marginLeft: hasVote ? 20 : 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: !hasVote ? "#fff" : null,
                fontWeight: "bold",
                backgroundColor: !hasVote ? styles.secondary() : null,
                border: "none",
                width: "auto"
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

    const renderRankings = rankings => {
      let displayRankings = [...rankings];

      const sorted = sortArrayByProperty(
        displayRankings,
        isPurgatory ? "prediction" : "absDiff",
        !isPurgatory
      );

      const renderSingle = (member, i = 1) => {
        const isMM = member.name === "Movie Medium";
        const isUser = member.id === user._id;
        const isRT = member.name === "Rotten Tomatoes Score";

        let strokeColor = styles.black(0.3),
          textColor = styles.black(0.7);
        if (isUser) {
          strokeColor = styles.primary(1);
          textColor = styles.primary(1);
        } else if (isRT) {
          strokeColor = styles.secondary(1);
          textColor = styles.secondary(1);
        } else if (isMM) {
          strokeColor = styles.black(0.1);
          textColor = styles.black(0.5);
        }

        const prediction =
          member.prediction < 0 || member.prediction > 100
            ? 101
            : member.prediction;

        const rightNumber =
          member.prediction < 0 ? "No prediction" : `${prediction}%`;

        if (prediction === null) return null;
        return (
          <div key={i} style={{ width: "100%", marginBottom: 5 }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  flex: 3,
                  fontWeight: !isMM ? "bold" : "normal",
                  fontStyle: isMM ? "italic" : "normal",
                  color: textColor,
                  textAlign: "left",
                  fontSize: 12
                }}
              >
                {isUser ? "You" : member.name}
                {!isRT &&
                  isPast && (
                    <span
                      style={{
                        color: styles.black(0.3),
                        margin: "0px 3px",
                        fontSize: 12,
                        fontWeight: "normal"
                      }}
                    >
                      {isUser ? "were" : "was"}
                    </span>
                  )}
                {/*{!isRT && isPast && <span>{member.diff < 0 ? "-" : "+"}</span>}*/}
                {!isRT && isPast && `${member.absDiff}%`}
                {!isRT &&
                  isPast && (
                    <span
                      style={{
                        color: styles.black(0.3),
                        margin: "0px 3px",
                        fontSize: 12,
                        fontWeight: "normal"
                      }}
                    >
                      off
                    </span>
                  )}
              </div>
              <div
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontWeight: !isMM ? "bold" : "normal",
                  fontStyle: isMM ? "italic" : "normal",
                  color: textColor,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  fontSize: member.prediction < 0 ? 12 : 16
                }}
              >
                {/*{isUser && (*/}
                {/*<span*/}
                {/*style={{*/}
                {/*color: styles.black(0.3),*/}
                {/*paddingRight: 5,*/}
                {/*fontWeight: "normal",*/}
                {/*fontSize: 12*/}
                {/*}}*/}
                {/*>*/}
                {/*{isPurgatory*/}
                {/*? `prediction =`*/}
                {/*: `${*/}
                {/*movie.rtScore*/}
                {/*}% score - ${prediction}% prediction  = `}*/}
                {/*</span>*/}
                {/*)}*/}

                {rightNumber}
              </div>
            </div>
            <Line
              percent={prediction}
              strokeWidth="2"
              strokeColor={strokeColor}
              trailWidth={0}
              trailColor={styles.black(0.05)}
            />
          </div>
        );
      };

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "stretch",
            alignItems: "center"
          }}
        >
          {isPast &&
            renderSingle({
              name: "Rotten Tomatoes Score",
              prediction: movie.rtScore,
              diff: 0,
              absDiff: 0
            })}
          {sorted.map((member, i) => renderSingle(member, i))}
        </div>
      );
    };

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: styles.isWide ? 50 : 30,
          backgroundColor: styles.white(),
          borderTop: `1px solid ${styles.black(0.05)}`,
          borderBottom: `1px solid ${styles.black(0.05)}`
        }}
      >
        {showTrailer && renderVideo(this.youtube_parser(movie.trailer))}
        <div
          style={{
            width: "100%",
            maxWidth: 500,
            display: "block",
            padding: "10px 20px 10px 20px",
            color: "rgba(0,0,0,0.7)"
          }}
        >
          <a
            href={movie.rtLink}
            style={{
              padding: "0px 0px",
              marginBottom: "5px",
              fontWeight: "bold",
              color: styles.black(0.9),
              fontSize: 18
            }}
          >
            {movie.title}
          </a>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 10
            }}
          >
            {isUpcoming && (
              <h6 style={{ margin: "5px 10px 5px 0px" }}>
                <span>🔒</span>
                <strong>{releaseCountdownText}</strong>
              </h6>
            )}
            <h6 style={{ margin: "5px 10px 5px 0px" }}>
              <span>🎥</span>
              {/*<strong>{daysUntilRelease} days</strong>{" "}*/}
              <span style={{ color: "#888", marginLeft: 2 }}>
                {moment(movie.releaseDate * 1000).format("MMM DD, YYYY")}
              </span>
            </h6>

            <h6 style={{ margin: "5px 10px 5px 0px" }}>
              <span>🍅</span>
              <a style={{ marginLeft: 2 }} href={movie.rtLink}>
                View on Rotten Tomatoes
              </a>
            </h6>
          </div>
          {allowEdit && renderInput(movie)}
          {!isUpcoming && renderRankings(this.props.groupData)}
        </div>
      </div>
    );
  }
}

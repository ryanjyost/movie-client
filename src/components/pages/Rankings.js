import React, { Component } from "react";
import axios from "axios";
import { Line } from "rc-progress";
import Select from "react-select";
import { Redirect } from "react-router-dom";

export default class Rankings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rankings: [],
      selectedGroup: null,
      didMount: false
    };
  }

  componentDidMount() {
    if (this.props.user.groups.length) {
      this.setState({
        selectedGroup: this.props.user
          ? {
              value: this.props.user.groups[0]._id,
              label: this.makeLabel(this.props.user.groups[0])
            }
          : null
      });
      this.getRankings(
        typeof this.props.user.groups[0] === "object"
          ? this.props.user.groups[0]._id
          : this.props.user.groups[0]
      );
    }

    this.setState({ didMount: true });
  }

  getRankings(groupId) {
    axios
      .get(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/groups/${groupId}/rankings`
      )
      .then(response => {
        if (response.data) {
          this.setState({ rankings: response.data.rankings });
        }
      })
      .catch(e => console.log(e));
  }

  makeLabel(group) {
    if (group && group.members) {
      let text = `${group.name} - `;
      for (let member of group.members) {
        if (member.name !== "Movie Medium") {
          text = text + " " + member.name;
        }
      }

      return text;
    }

    return "";
  }

  handleSelect(option) {
    this.setState({ selectedGroup: option });
    this.getRankings(option.value);
  }

  render() {
    const { styles, user } = this.props;
    const { selectedGroup } = this.state;

    if (!this.state.didMount || !this.state.rankings) {
      return null;
    } else if (
      Array.isArray(this.state.rankings) &&
      !this.state.rankings.length
    ) {
      return null;
    }

    if (!this.state.selectedGroup) {
      return <Redirect to={"/create-group"} />;
    }

    const options = this.props.user.groups.map(group => {
      return { value: group._id, label: this.makeLabel(group) };
    });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 500,
          padding: "100px 0px",
          margin: "auto"
        }}
      >
        <h3
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: styles.primary(1),
            marginBottom: 0
          }}
        >
          Group Rankings
        </h3>
        <div
          style={{
            padding: "5px 0px 20px 0px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            color: styles.black(0.6)
          }}
        >
          Your score is how far off your predictions are, on average.
        </div>
        {this.props.user &&
          this.props.user.groups.length > 1 && (
            <div
              style={{
                width: 400,
                maxWidth: "100%",
                marginBottom: 20,
                padding: "0px 20px"
              }}
            >
              <Select
                options={options}
                value={selectedGroup || { label: "", value: null }}
                onChange={option => this.handleSelect(option)}
              />
            </div>
          )}
        {this.state.rankings.map((member, i) => {
          const isUser = member.id === user._id;
          const isMM = member.name === "Movie Medium";

          let strokeColor = styles.black(0.3),
            textColor = styles.black(0.7);
          if (isUser) {
            strokeColor = styles.primary(1);
            textColor = styles.primary(1);
          } else if (isMM) {
            strokeColor = styles.black(0.1);
            textColor = styles.black(0.5);
          }
          return (
            <div
              key={i}
              style={{ width: "100%", marginBottom: 10, padding: "0px 20px" }}
            >
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
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  {member.name}{" "}
                </div>
                <div
                  style={{
                    flex: 1,
                    textAlign: "right",
                    fontWeight: !isMM ? "bold" : "normal",
                    fontStyle: isMM ? "italic" : "normal",
                    color: textColor,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    fontSize: member.prediction < 0 ? 12 : 16
                  }}
                >
                  <span>
                    {member.numMoviesUserPredicted < 1
                      ? "None yet"
                      : member.avgDiff}
                    {member.numMoviesUserPredicted < 1 ? "" : "%"}
                  </span>
                  <span style={{ fontSize: 10, opacity: 0.8 }}>
                    based on {member.numMoviesUserPredicted} movies
                  </span>
                </div>
              </div>
              <Line
                percent={member.avgDiff}
                strokeWidth="2"
                strokeColor={strokeColor}
                trailWidth={0}
                trailColor={styles.black(0.05)}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

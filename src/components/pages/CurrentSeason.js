import React, { Component } from "react";
import axios from "axios";
import { Line } from "rc-progress";
import Select from "react-select";
import { Redirect } from "react-router-dom";
import Loader from "../Loader";
import { getNameAbbr } from "../../lib/helpers";

export default class CurrentSeason extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rankings: [],
      selectedGroup: null,
      didMount: false,
      seasons: [],
      recentSeason: null,
      seasonInfo: null,
      selectedSeason: {
        value: 0,
        label: `All Seasons`
      },
      seasonOptions: []
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

      this.getSeasons();
    }

    this.setState({ didMount: true });
  }

  getSeasons() {
    axios
      .get(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/seasons`
      )
      .then(response => {
        if (response.data) {
          const seasonOptions = response.data.seasons.map(season => {
            return { value: season.id, label: `Season ${season.id}` };
          });
          seasonOptions.unshift({ value: 0, label: "All Seasons" });
          this.setState({
            seasons: response.data.seasons,
            recentSeason: response.data.seasons[0],
            seasonInfo: response.data.seasons[0],
            selectedSeason: {
              value: 0,
              label: `All Seasons`
            },
            seasonOptions
          });
        }
      })
      .catch(e => console.log(e));
  }

  getRankings(groupId) {
    axios
      .get(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/groups/${groupId ||
          "all"}/rankings/recent`
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
    const { selectedGroup, seasonInfo } = this.state;

    const showLoader =
      !this.state.didMount ||
      !this.state.rankings ||
      Array.isArray(this.state.rankings)
        ? !this.state.rankings.length
        : false;

    if (!showLoader && !this.state.selectedGroup) {
      return <Redirect to={"/create-group"} />;
    }

    const options = this.props.user.groups.map(group => {
      return { value: group._id, label: this.makeLabel(group) };
    });

    const seasonIsOver = seasonInfo
      ? seasonInfo.length === seasonInfo.movies.length
      : false;

    const emojiMap = [`🥇`, `🥈`, `🥉`];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 500,
          padding: "130px 0px",
          margin: "auto"
        }}
      >
        {seasonInfo && (
          <div
            style={{
              padding: "5px 0px 5px 0px",
              // display: "flex",
              // alignItems: "center",
              // justifyContent: "center",
              marginBottom: 20,
              color: styles.primary(0.9),
              textAlign: "center"
            }}
          >
            <h4 style={{ opacity: 0.9 }}>
              <span style={{ color: styles.primary(0.5) }}>
                {seasonIsOver
                  ? "Final Results for "
                  : `${seasonInfo.length -
                      seasonInfo.movies.length} movies left in `}
              </span>
              <strong>{`Season ${seasonInfo.id}`}</strong>{" "}
            </h4>
            {/*<div*/}
            {/*style={{*/}
            {/*marginTop: 10,*/}
            {/*color: styles.black(0.7),*/}
            {/*width: "100%",*/}
            {/*display: "flex",*/}
            {/*flexWrap: "wrap",*/}
            {/*justifyContent: "center"*/}
            {/*}}*/}
            {/*>*/}
            {/*{seasonInfo.movies.map(movie => {*/}
            {/*return (*/}
            {/*<span*/}
            {/*style={{*/}
            {/*margin: 3,*/}
            {/*fontSize: 12,*/}
            {/*padding: "3px 6px",*/}
            {/*fontWeight: "bold",*/}
            {/*backgroundColor: styles.primary(0.6),*/}
            {/*borderRadius: 3,*/}
            {/*// border: `1px solid ${styles.primary(0.5)}`,*/}
            {/*color: styles.white(1)*/}
            {/*}}*/}
            {/*>*/}
            {/*{movie.title}*/}
            {/*</span>*/}
            {/*);*/}
            {/*})}*/}
            {/*</div>*/}
          </div>
        )}

        {showLoader ? (
          <div style={{ marginTop: 50 }}>
            <Loader width={70} />
          </div>
        ) : (
          <React.Fragment>
            {this.props.user &&
              this.props.user.groups.length > 1 && (
                <div
                  style={{
                    width: "100%",
                    marginBottom: 10,
                    padding: "0px 10px"
                  }}
                >
                  <Select
                    inputProps={{ readOnly: true }}
                    isSearchable={false}
                    options={options}
                    value={selectedGroup || { label: "", value: null }}
                    onChange={option => this.handleSelect(option)}
                  />
                </div>
              )}

            <div
              style={{
                padding: "0px 10px",
                width: "100%",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: 10,
                  fontStyle: "italic",
                  backgroundColor: styles.primary(0.8),
                  padding: "6px 10px",
                  color: styles.white(1),
                  borderRadius: 3
                }}
              >
                <h5>Player</h5> <h5>Season Points</h5>
              </div>
            </div>
            {this.state.rankings.map((member, i) => {
              const isUser = member.id === user._id;

              const isMM = member.name === "Movie Medium";
              if (isMM) return null;

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
                  style={{
                    width: "100%",
                    marginBottom: 10,
                    padding: "0px 20px"
                  }}
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
                        flex: 2,
                        fontWeight: !isMM ? "bold" : "normal",
                        fontStyle: isMM ? "italic" : "normal",
                        color: textColor,
                        textAlign: "left",
                        fontSize: 16,
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <span style={{ fontSize: 20 }}>
                        {(seasonIsOver && emojiMap[member.place - 1]) || ""}
                      </span>
                      {getNameAbbr(member.name)}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontWeight: "normal",
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
                        <strong>{`${member.points}`}</strong>
                      </span>

                      {/*<span style={{ fontSize: 10, opacity: 0.8 }}>*/}
                      {/*{member.notInSeason*/}
                      {/*? "Player will be in next season"*/}
                      {/*: `based on ${member.moviesInCalc} movies`}*/}
                      {/*</span>*/}
                    </div>
                  </div>
                  {/*<Line*/}
                  {/*percent={member.avgDiff}*/}
                  {/*strokeWidth="2"*/}
                  {/*strokeColor={strokeColor}*/}
                  {/*trailWidth={0}*/}
                  {/*trailColor={styles.black(0.05)}*/}
                  {/*/>*/}
                </div>
              );
            })}
          </React.Fragment>
        )}
      </div>
    );
  }
}

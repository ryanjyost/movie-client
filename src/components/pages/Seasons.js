import React, { Component } from "react";
import axios from "axios";
import { Line } from "rc-progress";
import Select from "react-select";
import { Redirect } from "react-router-dom";
import Loader from "../Loader";
import { getNameAbbr } from "../../lib/helpers";

export default class Seasons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      didMount: false,
      selectedGroup: null,
      groupInfo: null,
      seasons: [],
      groupOptions: [],
      selectedSeason: null,
      seasonInfo: null,
      seasonOptions: [],
      seasonWinsByUser: {}
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
      this.getSeasons();
    }

    this.setState({ didMount: true });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !prevState.groupInfo &&
      !!this.state.groupInfo &&
      this.state.seasons.length
    ) {
      this.createGroupAndSeasonData(this.state.groupInfo, this.state.seasons);
    }
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
            selectedSeason: {
              value: 0,
              label: `All Seasons`
            },
            seasonOptions
          });

          this.getGroupInfo(this.props.user.groups[0]._id);
        }
      })
      .catch(e => console.log(e));
  }

  getGroupInfo(groupId) {
    axios
      .get(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/groups/${groupId}`
      )
      .then(response => {
        if (response.data) {
          this.setState({ groupInfo: response.data.group });
          this.createGroupAndSeasonData(
            response.data.group,
            this.state.seasons
          );
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

  handleSelectGroup(option) {
    this.setState({ selectedGroup: option });
    this.getGroupInfo(option.value);
  }

  handleSelectSeason(option) {
    const seasonInfo = this.state.seasons.find(
      season => season.id === option.value
    );

    this.setState({ selectedSeason: option, seasonInfo });
    this.createGroupAndSeasonData(this.state.groupInfo, seasonInfo);
  }

  createGroupAndSeasonData(groupInfo, seasons) {
    let data = {};

    for (let season of seasons) {
      let winners = season.winnerMap[groupInfo._id];
      if (winners) {
        if (Array.isArray(winners)) {
          for (let winner of winners) {
            if (winner in data) {
              data[winner] = data[winner] + 1;
            } else {
              data[winner] = 1;
            }
          }
        } else {
          let winner = winners;
          if (winner in data) {
            data[winner] = data[winner] + 1;
          } else {
            data[winner] = 1;
          }
        }
      }
    }

    this.setState({ seasonWinsByUser: data });
  }

  render() {
    const { styles, user } = this.props;
    const {
      selectedGroup,
      selectedSeason,
      seasonOptions,
      seasons,
      groupInfo,
      seasonWinsByUser
    } = this.state;

    const showLoader =
      !this.state.didMount || !selectedGroup || !selectedSeason;

    if (!showLoader && !this.state.selectedGroup) {
      return <Redirect to={"/create-group"} />;
    }

    const options = this.props.user.groups.map(group => {
      return { value: group._id, label: this.makeLabel(group) };
    });

    const renderGroupSelect = () => {
      return (
        this.props.user &&
        this.props.user.groups.length > 1 && (
          <div
            style={{
              width: "100%",
              marginBottom: 10,
              padding: "0px 10px"
            }}
          >
            {/*<h5*/}
            {/*style={{*/}
            {/*marginBottom: 10,*/}
            {/*color: styles.black(0.5),*/}
            {/*fontWeight: "normal",*/}
            {/*textAlign: "center"*/}
            {/*}}*/}
            {/*>*/}
            {/*Drill down to specific groups and seasons*/}
            {/*</h5>*/}

            {/*<Select*/}
            {/*options={seasonOptions}*/}
            {/*value={selectedSeason || { label: "", value: null }}*/}
            {/*onChange={option => this.handleSelectSeason(option)}*/}
            {/*/>*/}
            {/*<div style={{ height: 10 }} />*/}
            <Select
              inputProps={{ readOnly: true }}
              isSearchable={false}
              options={options}
              value={selectedGroup || { label: "", value: null }}
              onChange={option => this.handleSelectGroup(option)}
            />
          </div>
        )
      );
    };

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
        {showLoader ? (
          <div style={{ marginTop: 50 }}>
            <Loader width={70} />
          </div>
        ) : (
          <React.Fragment>
            {renderGroupSelect()}
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
                <h5>Player</h5>{" "}
                <h5>
                  {!selectedSeason.value
                    ? "Seasons Won"
                    : "MM Metric for the Season"}
                </h5>
              </div>
            </div>
            {groupInfo
              ? groupInfo.members.map((member, i) => {
                  if (member.isMM) return null;
                  const isUser = member.id === user._id;

                  let strokeColor = styles.black(0.3),
                    textColor = styles.black(0.7);
                  if (isUser) {
                    strokeColor = styles.primary(1);
                    textColor = styles.primary(1);
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
                            color: textColor,
                            textAlign: "left",
                            fontSize: 16,
                            display: "flex",
                            alignItems: "center"
                          }}
                        >
                          {getNameAbbr(member.name)}
                        </div>
                        <div
                          style={{
                            flex: 1,
                            textAlign: "right",
                            fontWeight: "normal",
                            color: textColor,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            justifyContent: "center",
                            fontSize: member.prediction < 0 ? 12 : 16
                          }}
                        >
                          <span>
                            <strong>
                              {member._id in seasonWinsByUser
                                ? seasonWinsByUser[member._id]
                                : 0}
                            </strong>
                          </span>
                          {/*<span style={{ fontSize: 10, opacity: 0.8 }}>*/}
                          {/*based on {member.moviesInCalc} movies*/}
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
                })
              : null}
          </React.Fragment>
        )}
      </div>
    );
  }
}

import React, { Component } from "react";
import axios from "axios";
import Movie from "../Movie";
import Select from "react-select";

class PastPredictions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      filteredMovies: [],
      predictionBreakdowns: null,
      group: null,
      selectedGroup: null,
      seasons: [],
      selectedSeason: { value: 0, label: "All Seasons" },
      seasonInfo: null,
      seasonOptions: []
    };
  }

  componentDidMount() {
    this.setState({
      selectedGroup: {
        value: this.props.user.groups[0]._id,
        label: this.makeLabel(this.props.user.groups[0])
      }
    });
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
          movies: sorted,
          filteredMovies: sorted
        });
      })
      .catch(e => console.log(e));

    this.getGroupBreakdowns(this.props.user.groups[0]._id);
    this.getSeasons();
  }

  getGroupBreakdowns(groupId) {
    axios
      .get(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/group_breakdowns/${groupId}/past`
      )
      .then(response => {
        this.setState({ predictionBreakdowns: response.data.breakdowns });
      })
      .catch(e => console.log(e));
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
    } else {
      return "";
    }
  }

  handleSelect(option) {
    this.setState({ selectedGroup: option });
    this.getGroupBreakdowns(option.value);
  }

  handleSelectSeason(option) {
    const seasonInfo = this.state.seasons.find(
      season => season.id === option.value
    );

    const movies = this.state.movies.filter(movie => {
      if (!option.value) return true;
      return option.value === movie.season;
    });

    this.setState({
      selectedSeason: option,
      seasonInfo,
      filteredMovies: movies
    });
  }

  render() {
    const { user, styles } = this.props;
    const { selectedGroup } = this.state;

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
          padding: "120px 0px",
          margin: "auto"
        }}
      >
        <h5
          style={{
            textAlign: "center",
            // fontWeight: "bold",
            color: styles.primary(0.7)
          }}
        >
          View past movie results and seasons
        </h5>
        <h5 style={{ margin: "10px 0px 20px 0px", color: styles.primary(0.4) }}>
          &darr;
        </h5>
        <div
          style={{
            width: 400,
            maxWidth: "100%",
            marginBottom: 20,
            padding: "0px 20px"
          }}
        >
          <Select
            inputProps={{ readOnly: true }}
            isSearchable={false}
            options={this.state.seasonOptions}
            value={this.state.selectedSeason || { label: "", value: null }}
            onChange={option => this.handleSelectSeason(option)}
          />
          <div style={{ height: 10, width: "100%" }} />
          {this.props.user &&
            this.props.user.groups.length > 1 && (
              <Select
                inputProps={{ readOnly: true }}
                isSearchable={false}
                options={options}
                value={selectedGroup || { label: "", value: null }}
                onChange={option => this.handleSelect(option)}
              />
            )}
        </div>
        {this.state.filteredMovies.map((movie, i) => {
          return (
            <Movie
              isPast
              key={i}
              user={this.props.user}
              movie={movie}
              groupData={
                this.state.predictionBreakdowns
                  ? this.state.predictionBreakdowns[movie._id] || []
                  : []
              }
              styles={styles}
              updateUser={this.props.updateUser}
            />
          );
        })}
      </div>
    );
  }
}

export default PastPredictions;

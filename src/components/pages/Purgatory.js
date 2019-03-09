import React, { Component } from "react";
import axios from "axios";
import Movie from "../Movie";
import Select from "react-select";

class Purgatory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      predictionBreakdowns: null,
      group: null,
      selectedGroup: null
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

    this.getGroupBreakdowns(this.props.user.groups[0]._id);
  }

  getGroupBreakdowns(groupId) {
    axios
      .get(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/group_breakdowns/${groupId}/purgatory`
      )
      .then(response => {
        this.setState({ predictionBreakdowns: response.data.breakdowns });
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

  render() {
    const { styles } = this.props;
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
        <h5
          style={{
            textAlign: "center",
            // fontWeight: "bold",
            color: styles.primary(0.7)
          }}
        >
          Predictions are locked in. Waiting for the RT score...
        </h5>
        <h5 style={{ margin: "10px 0px 20px 0px", color: styles.primary(0.4) }}>
          &darr;
        </h5>
        {this.state.movies.map((movie, i) => {
          return (
            <Movie
              isPurgatory
              key={i}
              user={this.props.user}
              movie={movie}
              groupData={
                this.state.predictionBreakdowns
                  ? this.state.predictionBreakdowns[movie._id]
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

export default Purgatory;

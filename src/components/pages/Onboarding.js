import React, { Component } from "react";
import withStyles from "../../lib/withStyles";
import axios from "axios";
import Select from "react-select";
// import "react-select/dist/react-select.css";

class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      selectedGroup: null
    };
  }

  componentDidMount() {
    console.log("USER ONBOARD", this.props.user);
    axios
      .post(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/groupme/groups`,
        {
          access_token: this.props.user.accessToken
        }
      )
      .then(response => {
        console.log("GROUPS", response);

        let filtered = response.data.groups.filter(group => {
          console.log(group, this.props.user);
          return group.creator_user_id === this.props.user.groupmeId;
        });
        this.setState({ groups: filtered });
      })
      .catch(e => console.log(e));

    if (!this.props.user._id) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL ||
            "https://predict-movies-prod.herokuapp.com"}/groupme/users/me`,
          {
            access_token: this.props.user.accessToken
          }
        )
        .then(response => {
          this.props.updateUser(response.data.user);
        })
        .catch(e => console.log(e));
    }
  }

  render() {
    const { styles } = this.props;

    const options = this.state.groups.map(group => {
      return { value: group.id, label: group.name };
    });

    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: "50px 20px",
          backgroundColor: styles.primary(1),
          minHeight: "100vh",
          maxWidth: 500,
          margin: "auto"
        }}
      >
        <div>
          <h2 style={{ color: "#fff", fontWeight: "bold", marginBottom: 5 }}>
            Start a Movie Medium Group
          </h2>
          <p style={{ color: "#fff", marginBottom: 20 }}>
            As of now, groups of friends play the Movie Medium game through
            GroupMe. Eventually, we'll add{" "}
          </p>
          <h4 style={{ color: styles.white(0.95), margin: "10px 0px" }}>
            Use an existing GroupMe group
          </h4>
          <Select
            options={options}
            placeholder={"Select an existing GroupMe group..."}
            value={this.state.selectedGroup}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(Onboarding);

import React, { Component } from "react";
import withStyles from "../../lib/withStyles";
import LoadingScreen from "../../components/LoadingScreen";
import axios from "axios";
import { FormControl, Button, Checkbox } from "react-bootstrap";
import { Redirect, Link } from "react-router-dom";
import Storage from "store";

class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      selectedGroup: null,
      createdGroup: null,
      groupName: "Movie Medium",
      loadingMessage: "Authenticating via GroupMe..."
    };
  }

  componentDidMount() {
    Storage.remove("creatingGroup");
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
    } else {
      this.setState({ loadingMessage: null });
    }
  }

  createGroup(isExisting) {
    this.setState({ loadingMessage: "Creating your group..." });
    axios
      .post(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/groups/create`,
        {
          accessToken: this.props.user.accessToken,
          user: this.props.user
        }
      )
      .then(response => {
        console.log("the group was created");
        Storage.set("createdGroup", true);
        this.setState({
          createdGroup: response.data.createdGroup
        });
        this.props.updateUser(response.data.user);
      })
      .catch(e => console.log(e));
  }

  render() {
    const { styles } = this.props;

    const options = this.state.groups.map(group => {
      return { value: group.id, label: group.name };
    });

    const renderCreateGroup = () => {
      return (
        <div
          style={{
            backgroundColor: styles.primary(1),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "50px 20px",
              backgroundColor: styles.primary(1),
              minHeight: "100vh",
              maxWidth: 600,
              margin: "auto"
            }}
          >
            <h3
              style={{
                color: "#fff",
                marginBottom: 0,
                textAlign: "center",
                lineHeight: 1.4,
                fontWeight: "bold"
              }}
            >
              Create a GroupMe chat<br /> that's linked to Movie Medium
            </h3>

            <Button
              onClick={() => this.createGroup(false)}
              style={{
                margin: "20px 0px 0px 0px",
                backgroundColor: styles.secondary(),
                color: "#fff",
                fontWeight: "bold",
                padding: "10px 20px",
                textDecoration: "none",
                borderRadius: 3,
                fontSize: 20,
                border: "none"
              }}
              className={"hoverBtn"}
            >
              Create my group
            </Button>
            <h6
              style={{
                textAlign: "center",
                maxWidth: 400,
                color: styles.white(0.7),
                marginTop: 20
              }}
            >
              By creating your new Movie Medium Group and the linked GroupMe
              chat, you agree to our{" "}
              <Link style={{ color: "#fff" }} to={"/terms"}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link style={{ color: "#fff" }} to={"/privacy"}>
                Privacy Policy
              </Link>.
            </h6>
          </div>
        </div>
      );
    };

    if (this.state.createdGroup) {
      return <Redirect to={"/rules"} />;
    } else if (!this.props.user.accessToken) {
      return <Redirect to={"/"} />;
    } else if (this.state.loadingMessage) {
      return (
        <LoadingScreen styles={styles} message={this.state.loadingMessage} />
      );
    } else {
      return renderCreateGroup();
    }
  }
}

export default withStyles(Onboarding);

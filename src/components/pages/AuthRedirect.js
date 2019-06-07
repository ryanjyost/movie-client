import React, { Component } from "react";
import LoadingScreen from "../LoadingScreen";
import axios from "axios/index";
import { Redirect } from "react-router-dom";
import Storage from "store";

export default class AuthRedirect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToHome: false,
      redirectToOnboarding: false,
      redirectToApp: false,
      redirectToRules: false
    };
  }

  componentDidMount() {
    if (window.location.search) {
      let accessToken = window.location.search.replace("?access_token=", "");

      axios
        .post(
          `${process.env.REACT_APP_API_URL ||
            "https://predict-movies-prod.herokuapp.com"}/users/login`,
          {
            access_token: accessToken
          }
        )
        .then(response => {
          this.props.updateUser({ ...response.data.user, ...{ accessToken } });
          if (Storage.get("creatingGroup")) {
            this.setState({ redirectToOnboarding: true });
          } else if (response.data.user.isNew) {
            this.setState({ redirectToRules: true });
          } else if (response.data.user.groups.length) {
            this.setState({ redirectToApp: true });
          } else if (!response.data.user.groups.length) {
            this.setState({ redirectToOnboarding: true });
          } else {
            this.setState({ redirectToHome: true });
          }
        })
        .catch(e => {
          this.setState({ redirectToHome: true });
          console.log(e);
        });
    }
  }

  render() {
    const { styles } = this.props;
    const {
      redirectToHome,
      redirectToOnboarding,
      redirectToApp,
      redirectToRules
    } = this.state;

    if (redirectToHome) {
      return <Redirect to={"/"} />;
    }
    if (redirectToRules) {
      return <Redirect to={"/rules"} />;
    }
    if (redirectToOnboarding) {
      return <Redirect to={"/create-group"} />;
    }
    if (redirectToApp) {
      return <Redirect to={"/upcoming"} />;
    }
    return <LoadingScreen styles={styles} message={"Logging you in..."} />;
  }
}

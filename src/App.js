import React, { Component } from "react";
import axios from "axios";
import Upcoming from "./components/pages/Upcoming";
import Admin from "./components/pages/Admin";
import Home from "./components/pages/Home";
import Purgatory from "./components/pages/Purgatory";
import PastPredictions from "./components/pages/PastPredictions";
import Onboarding from "./components/pages/Onboarding";
import Join from "./components/Join";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";

function renderAuthRoute(Component, props, user, updateUser) {
  if (!user || !user.accessToken) {
    return <Home {...props} updateUser={user => updateUser(user)} />;
  } else if (!user.groups || !user.groups.length) {
    return (
      <Onboarding
        {...props}
        user={user}
        updateUser={user => updateUser(user)}
      />
    );
  } else {
    return (
      <Component {...props} user={user} updateUser={user => updateUser(user)} />
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      didMount: false,
      accessToken: null,
      user: null
    };
  }

  componentDidMount() {
    this.setState({ didMount: true });
    if (window.localStorage.getItem("userId")) {
      // get prev auth user
      let userId = window.localStorage.getItem("userId");
      axios
        .get(
          `${process.env.REACT_APP_API_URL ||
            "https://predict-movies-prod.herokuapp.com"}/users/${userId}`
        )
        .then(response => {
          window.localStorage.setItem("userId", response.data.user._id);
          this.setState({
            user: response.data.user
          });
        })
        .catch(e => console.log(e));
    }
    //   if (window.location.search) {
    //     let accessToken = window.location.search.replace("?access_token=", "");
    //     this.setState({ accessToken });
    //     if (accessToken) {
    //       axios
    //         .post("http://localhost:8000/users/login", {
    //           access_token: accessToken
    //         })
    //         .then(response => {
    //           console.log(response);
    //         })
    //         .catch(e => console.log(e));
    //     }
    //   }
  }

  updateUser(user) {
    this.setState({ user });
    window.localStorage.setItem("userId", user._id);
  }

  render() {
    const { user } = this.state;
    console.log("USER", user);
    const showHeader =
      (this.props.location.pathname === "/upcoming" ||
        this.props.location.pathname === "/purgatory" ||
        this.props.location.pathname === "/past") &&
      user;

    const linkStyle = {
      margin: "0px 10px",
      fontSize: 16,
      flex: 0.32,
      textAlign: "center"
    };

    const renderLink = (link, label) => {
      const location = this.props.location.pathname;
      return (
        <Link
          to={link}
          style={{
            ...linkStyle,
            ...{
              fontWeight: location === link ? "bold" : "normal",
              textDecoration: location === link ? "underline" : null
            }
          }}
        >
          {label}
        </Link>
      );
    };

    if (!this.state.didMount) {
      return null;
    }
    return (
      <div style={{ padding: showHeader ? "50px 0px" : 0 }}>
        {showHeader ? (
          <header
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              margin: "auto",
              maxWidth: 500,
              alignItems: "center"
            }}
          >
            {renderLink("/upcoming", "Upcoming")}
            {renderLink("/purgatory", " Purgatory")}
            {renderLink("/past", "Past")}
          </header>
        ) : null}
        <Switch>
          <Route
            path="/"
            exact
            render={props => {
              if (!user || !user.accessToken) {
                return <Home updateUser={user => this.updateUser(user)} />;
              } else if (!user.groups || !user.groups.length) {
                return (
                  <Redirect
                    to={{
                      pathname: "/get-started",
                      state: { from: props.location }
                    }}
                  />
                );
              } else {
                return (
                  <Redirect
                    to={{
                      pathname: "/upcoming",
                      state: { from: props.location }
                    }}
                  />
                );
              }
            }}
          />
          <Route
            path="/upcoming"
            exact
            render={props =>
              renderAuthRoute(Upcoming, props, user, this.updateUser.bind(this))
            }
          />
          <Route
            path="/purgatory"
            exact
            render={props =>
              renderAuthRoute(
                Purgatory,
                props,
                user,
                this.updateUser.bind(this)
              )
            }
          />
          <Route
            path="/past"
            exact
            render={props =>
              renderAuthRoute(
                PastPredictions,
                props,
                user,
                this.updateUser.bind(this)
              )
            }
          />
          <Route
            path="/get-started"
            exact
            render={props =>
              renderAuthRoute(Home, props, user, this.updateUser.bind(this))
            }
          />

          <Route path="/join/:groupId" component={Join} />
          <Route
            path="/admin"
            exact
            render={props => {
              if (user && user.isAdmin) {
                return <Admin />;
              } else {
                return renderAuthRoute(
                  Home,
                  props,
                  user,
                  this.updateUser.bind(this)
                );
              }
            }}
          />
          {/*<Route component={Home} />*/}
        </Switch>
      </div>
    );
  }
}

export default App;

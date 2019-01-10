import React, { Component } from "react";
import axios from "axios";
import Upcoming from "./components/pages/Upcoming";
import Admin from "./components/pages/Admin";
import Home from "./components/pages/Home";
import Purgatory from "./components/pages/Purgatory";
import PastPredictions from "./components/pages/PastPredictions";
import Join from "./components/Join";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";

function renderAuthRoute(Component, props, user, styles, updateUser) {
  if (user) {
    return (
      <Component
        {...props}
        styles={styles}
        user={user}
        updateUser={user => updateUser(user)}
      />
    );
  } else {
    return (
      <Home {...props} styles={styles} updateUser={user => updateUser(user)} />
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
        .post(`http://localhost:8000/users/${userId}`)
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
  }

  render() {
    const { user } = this.state;
    const styles = {};
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
              if (user) {
                return (
                  <Redirect
                    to={{
                      pathname: "/upcoming",
                      state: { from: props.location }
                    }}
                  />
                );
              } else {
                return <Home updateUser={user => this.updateUser(user)} />;
              }
            }}
          />
          <Route
            path="/upcoming"
            exact
            render={props =>
              renderAuthRoute(
                Upcoming,
                props,
                user,
                styles,
                this.updateUser.bind(this)
              )
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
                styles,
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
                styles,
                this.updateUser.bind(this)
              )
            }
          />

          <Route path="/user" exact component={Home} />
          <Route path="/join/:groupId" component={Join} />
          <Route path="/admin" exact component={Admin} />
          <Route component={Home} />
        </Switch>
      </div>
    );
  }
}

export default App;

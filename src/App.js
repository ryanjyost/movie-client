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
import withStyles from "./lib/withStyles";

function renderAuthRoute(Component, props, user, updateUser, styles) {
  console.log("RENDER", user);
  if (user && (user.groups ? user.groups.length : false)) {
    return (
      <Component
        {...props}
        user={user}
        updateUser={user => updateUser(user)}
        styles={styles}
      />
    );
  } else if (user && user.accessToken) {
    return (
      <Onboarding
        {...props}
        user={user}
        updateUser={user => updateUser(user)}
        styles={styles}
      />
    );
  } else {
    return (
      <Home
        {...props}
        user={user}
        updateUser={user => updateUser(user)}
        styles={styles}
      />
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
    //   if (window.pathname.search) {
    //     let accessToken = window.pathname.search.replace("?access_token=", "");
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
    const { styles } = this.props;
    const pathname = this.props.location.pathname;
    const isApp = user && pathname !== "/";
    const showPredictionMenu =
      (pathname === "/upcoming" ||
        pathname === "/purgatory" ||
        pathname === "/past") &&
      user;

    const renderLink = (link, label) => {
      const isActive = pathname === link;

      const linkStyle = {
        fontSize: 12,
        flex: 1,
        justifyContent: "center",
        display: "flex",
        alignItems: "center"
      };

      return (
        <Link
          to={link}
          style={{
            ...linkStyle,
            ...{
              fontWeight: "bold",
              backgroundColor: !isActive ? styles.white() : styles.primary(1),
              color: !isActive ? styles.primary() : styles.white(),
              textDecoration: "none",
              borderLeft:
                link === "/purgatory" ? `1px solid ${styles.primary(1)}` : null,
              borderRight:
                link === "/purgatory" ? `1px solid ${styles.primary(1)}` : null
            }
          }}
        >
          {label}
        </Link>
      );
    };

    const renderAppHeader = () => {
      return (
        <div
          style={{
            height: styles.appHeaderHeight,
            width: "100%",
            backgroundColor: styles.primary(),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: styles.white(),
            fontSize: 16,
            fontWeight: "bold"
          }}
        >
          Movie Medium
        </div>
      );
    };

    const renderPredictionMenu = () => {
      return (
        <div
          style={{
            width: "100%",
            padding: "10px 0px",
            backgroundColor: styles.white(),
            borderBottom: `1px solid ${styles.black(0.1)}`
          }}
        >
          <div
            className={"toggleButtons"}
            style={{
              display: "flex",
              justifyContent: "center",
              width: "90%",
              margin: "auto",
              maxWidth: 500,
              alignItems: "stretch",
              border: `1px solid ${styles.primary(1)}`,
              // position: "fixed",
              // bottom: 0,
              height: styles.predictionMenuHeight,
              backgroundColor: styles.white()
              // borderTop: `1px solid ${styles.black(0.1)}`
            }}
          >
            {renderLink("/upcoming", "Upcoming")}
            {renderLink("/purgatory", " Purgatory")}
            {renderLink("/past", "Past")}
          </div>
        </div>
      );
    };

    if (!this.state.didMount) {
      return null;
    }
    return (
      <div
        style={{
          padding: 0,
          display: "relative",
          width: "100%"
        }}
      >
        <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1 }}>
          {isApp && renderAppHeader()}
          {showPredictionMenu ? renderPredictionMenu() : null}
        </div>
        <Switch>
          {/* HOME */}
          <Route
            path="/"
            exact
            render={props => (
              <Home
                user={user}
                updateUser={user => this.updateUser(user)}
                styles={styles}
              />
            )}
          />

          {/* UPCOMING */}
          <Route
            path="/upcoming"
            exact
            render={props =>
              renderAuthRoute(
                Upcoming,
                props,
                user,
                this.updateUser.bind(this),
                styles
              )
            }
          />

          {/* PURGATORY */}
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

          {/* PAST */}
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

          {/* ONBOARDING */}
          <Route
            path="/get-started"
            exact
            render={props =>
              renderAuthRoute(Home, props, user, this.updateUser.bind(this))
            }
          />

          {/*<Route path="/join/:groupId" component={Join} />*/}

          {/* ADMIN */}
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
                  this.updateUser.bind(this),
                  styles
                );
              }
            }}
          />
          <Route
            render={props => (
              <Home user={user} updateUser={user => this.updateUser(user)} />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default withStyles(App);

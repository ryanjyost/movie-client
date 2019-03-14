import React, { Component } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import withStyles from "./lib/withStyles";
import Storage from "store";

import Upcoming from "./components/pages/Upcoming";
import Admin from "./components/pages/Admin";
import Home from "./components/pages/Home";
import Purgatory from "./components/pages/Purgatory";
import PastPredictions from "./components/pages/PastPredictions";
import Onboarding from "./components/pages/Onboarding";
import AuthRedirect from "./components/pages/AuthRedirect";
import Rules from "./components/pages/Rules";
import LoadingScreen from "./components/LoadingScreen";
import Rankings from "./components/pages/Rankings";
import TermsOfUse from "./components/pages/TermsOfUse";
import Privacy from "./components/pages/Privacy";
import MainMenu from "./components/pages/MainMenu";

function renderAuthRoute(
  Component,
  props,
  user,
  updateUser,
  styles,
  overrideConditonal
) {
  if (
    (user && user.groups.length) ||
    overrideConditonal ||
    Storage.get("createdGroup")
  ) {
    Storage.remove("createdGroup");
    return (
      <Component
        {...props}
        user={user}
        updateUser={user => updateUser(user)}
        styles={styles}
      />
    );
  }
  // else if (user && user.accessToken) {
  //   return <Redirect to={"/get-started"} />;
  // }
  else {
    return <Redirect to={"/"} />;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      didMount: false,
      accessToken: null,
      user: null,
      didFetchUser: false
    };
  }

  componentDidMount() {
    this.setState({ didMount: true });
    if (Storage.get("userId")) {
      // get prev auth user
      let userId = Storage.get("userId");
      axios
        .get(
          `${process.env.REACT_APP_API_URL ||
            "https://predict-movies-prod.herokuapp.com"}/users/${userId}`
        )
        .then(response => {
          if (response.data.user) {
            Storage.set("userId", response.data.user._id);
          }

          this.setState({
            user: response.data.user,
            didFetchUser: true
          });
        })
        .catch(e => {
          console.log(e);
          this.setState({ didFetchUser: true });
        });
    } else {
      this.setState({ didFetchUser: true });
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
    Storage.set("userId", user._id);
  }

  render() {
    const { user } = this.state;
    const { styles } = this.props;
    const pathname = this.props.location.pathname;
    const isApp =
      user &&
      user.groups.length &&
      ["/upcoming", "/purgatory", "/past", "/rankings", "/rules"].indexOf(
        `${pathname}`
      ) > -1;

    const showPredictionMenu =
      (pathname === "/upcoming" ||
        pathname === "/purgatory" ||
        pathname === "/past") &&
      user &&
      user.groups.length;

    const menuItems = [
      {
        link: "/rankings",
        label: "Rankings",
        isActive: ["/rankings"].indexOf(`${pathname}`) > -1
      },
      {
        link: "/upcoming",
        label: "Predictions",
        isActive:
          ["/upcoming", "/purgatory", "/past"].indexOf(`${pathname}`) > -1
      },
      {
        link: "/rules",
        label: "How to Play",
        isActive: ["/rules"].indexOf(`${pathname}`) > -1
      }
    ];

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
              border: `1px solid ${styles.primary(1)}`,
              borderRight:
                link === "/purgatory" ? null : `1px solid ${styles.primary(1)}`,
              borderLeft:
                link === "/purgatory" ? null : `1px solid ${styles.primary(1)}`
            }
          }}
        >
          {label}
        </Link>
      );
    };

    const renderAppHeader = () => {
      const renderBar = () => {
        return (
          <div
            style={{
              width: "100%",
              height: 2,
              backgroundColor: styles.white(0.8),
              margin: "3px 0px",
              borderRadius: 3
            }}
          />
        );
      };

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: styles.primary(),
            height: styles.appHeaderHeight
          }}
        >
          <div style={{ flex: 1, color: "transparent" }}>h</div>
          <Link
            to={"/"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: styles.white(),
              fontSize: 16,
              fontWeight: "bold",
              flex: 3,
              textDecoration: "none"
            }}
          >
            Movie Medium
          </Link>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "center"
            }}
          >
            <Link to={"/menu"} style={{ width: 18, marginRight: 15 }}>
              {renderBar()}
              {renderBar()}
              {renderBar()}
            </Link>
          </div>
        </div>
      );
    };

    const renderAppFooter = () => {
      return (
        <div
          style={{
            height: 36,
            width: "100%",
            backgroundColor: styles.primary(1),
            position: "fixed",
            bottom: 0,
            display: "flex"
          }}
        >
          {menuItems.map((item, i) => {
            return (
              <Link
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  color: item.isActive ? "#fff" : styles.white(0.5),
                  fontWeight: item.isActive ? "bold" : "normal",
                  textDecoration: "none"
                }}
                to={item.link}
              >
                {item.label}
              </Link>
            );
          })}
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
              // border: `1px solid ${styles.primary(1)}`,
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

    if (!this.state.didFetchUser) {
      return <LoadingScreen styles={styles} />;
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
          {isApp ? renderAppHeader() : null}
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

          {/* Main Menu */}
          <Route
            path="/menu"
            exact
            render={props => <MainMenu {...props} styles={styles} />}
          />

          {/* Terms */}
          <Route
            path="/terms"
            exact
            render={props => <TermsOfUse {...props} styles={styles} />}
          />

          {/* Privacy */}
          <Route
            path="/privacy"
            exact
            render={props => <Privacy {...props} styles={styles} />}
          />

          {/* AUTH REDIRECT */}
          <Route
            path="/auth-redirect"
            render={props => {
              return (
                <AuthRedirect
                  {...props}
                  user={user}
                  styles={styles}
                  updateUser={this.updateUser.bind(this)}
                />
              );
            }}
          />

          {/* ONBOARDING */}
          <Route
            path="/create-group"
            exact
            render={props =>
              renderAuthRoute(
                Onboarding,
                props,
                user,
                this.updateUser.bind(this),
                styles,
                true
              )
            }
          />

          {/* RANKINGS */}
          <Route
            path="/rankings"
            exact
            render={props =>
              renderAuthRoute(
                Rankings,
                props,
                user,
                this.updateUser.bind(this),
                styles
              )
            }
          />

          {/* RANKINGS */}
          <Route
            path="/rules"
            exact
            render={props =>
              renderAuthRoute(
                Rules,
                props,
                user,
                this.updateUser.bind(this),
                styles
              )
            }
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
                this.updateUser.bind(this),
                styles
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
                this.updateUser.bind(this),
                styles
              )
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
          <Route render={props => <Redirect to={"/"} />} />
        </Switch>
        {isApp ? renderAppFooter() : null}
      </div>
    );
  }
}

export default withStyles(App);

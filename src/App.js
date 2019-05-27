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

import LoadingScreen from "./components/LoadingScreen";
import Admin from "./components/pages/Admin";
import AuthRedirect from "./components/pages/AuthRedirect";

import Home from "./components/pages/Home";
import Upcoming from "./components/pages/Upcoming";
import Purgatory from "./components/pages/Purgatory";
import PastPredictions from "./components/pages/PastPredictions";
import Onboarding from "./components/pages/Onboarding";
import Rules from "./components/pages/Rules";
import Seasons from "./components/pages/Seasons";
import Rankings from "./components/pages/Rankings";
import CurrentSeason from "./components/pages/CurrentSeason";
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

    this.deferredPrompt = null;
  }

  handleUserOnMount() {
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

          console.log(response.data.user);

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
  }

  handleAddToHomescreen() {
    if (!Storage.get("optedOutOfInstall")) {
      window.addEventListener("beforeinstallprompt", e => {
        const homeScreenContainer = document.querySelector(
          ".addToHomeScreenContainer"
        );

        const homeScreenButton = document.querySelector(".addToHomeScreen");
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e;

        if (homeScreenContainer && this.state.user) {
          homeScreenContainer.style.display = "flex";
          homeScreenButton.addEventListener("click", e => {
            homeScreenContainer.style.display = "none";
            this.deferredPrompt.prompt();
          });

          this.deferredPrompt.userChoice.then(choiceResult => {
            if (choiceResult.outcome === "accepted") {
              console.log("User accepted the A2HS prompt");
            } else {
              console.log("User dismissed the A2HS prompt");
              homeScreenContainer.style.display = "none";
              Storage.set("optedOutOfInstall", true);
            }
            this.deferredPrompt = null;
          });
        }
      });
    }
  }

  handleHomeScreenReject() {
    const homeScreenContainer = document.querySelector(
      ".addToHomeScreenContainer"
    );
    homeScreenContainer.style.display = "none";
    Storage.set("optedOutOfInstall", true);
  }

  componentDidMount() {
    this.setState({ didMount: true });

    this.handleUserOnMount();
    this.handleAddToHomescreen();

    window.YTConfig = {
      host: "https://youtube.com"
    };
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
      [
        "/upcoming",
        "/purgatory",
        "/past",
        "/seasons",
        "/current",
        "/rankings",
        "/rules"
      ].indexOf(`${pathname}`) > -1;

    const hasUserWithGroup = user && user.groups.length;

    const menuItems = [
      {
        link: "/current",
        label: "Leaderboard",
        isActive:
          ["/seasons", "/rankings", "/current"].indexOf(`${pathname}`) > -1
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

    const renderLink = (link, label, index, list) => {
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
          key={link}
          to={link}
          style={{
            ...linkStyle,
            ...{
              // fontWeight: isActive ? "bold" : "normal",
              backgroundColor: !isActive ? styles.white() : styles.secondary(1),
              color: !isActive ? styles.secondary() : styles.white(),
              textDecoration: "none",
              border: `1px solid ${styles.secondary(1)}`,
              borderRight:
                list.length === 3
                  ? index === 1
                    ? null
                    : `1px solid ${styles.secondary(1)}`
                  : `1px solid ${styles.secondary(1)}`,
              borderLeft:
                list.length === 3
                  ? index === 1
                    ? null
                    : `1px solid ${styles.secondary(1)}`
                  : `1px solid ${styles.secondary(1)}`
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
            height: styles.footerHeight,
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

    const renderSubMenu = () => {
      const menus = [
        [
          { link: "/upcoming", title: "Upcoming" },
          { link: "/purgatory", title: "Purgatory" },
          { link: "/past", title: "Past" }
        ],
        [
          { link: "/seasons", title: "Past Seasons" },
          { link: "/current", title: "Current Season" },
          { link: "/rankings", title: "Overall Rankings" }
        ]
      ];

      const currentSubMenu = menus.find(menu => {
        return menu.find(item => pathname === item.link);
      });

      if (!currentSubMenu || !hasUserWithGroup) return null;
      return (
        <div
          style={{
            width: "100%",
            padding: "10px 0px",
            backgroundColor: styles.white(),
            borderBottom: `1px solid ${styles.black(0.2)}`
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

              height: styles.predictionMenuHeight,
              backgroundColor: styles.white()
            }}
          >
            {currentSubMenu &&
              currentSubMenu.map((item, i) =>
                renderLink(item.link, item.title, i, currentSubMenu)
              )}
          </div>
        </div>
      );
    };

    const renderAddToHomeScreen = () => {
      return (
        <div
          style={{
            position: "fixed",
            bottom: -1,
            height: 70,
            width: "100%",
            zIndex: 10,
            backgroundColor: "#fff",
            display: "none",
            // flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid #fff",
            borderTop: "1px solid #e5e5e5",
            padding: "0px 20px"
          }}
          className={"addToHomeScreenContainer"}
        >
          <button
            className={"addToHomeScreen"}
            style={{
              backgroundColor: styles.primary(),
              border: `1px solid ${styles.primary()}`,
              color: "#fff",
              borderRadius: 3,
              fontSize: 16,
              padding: "5px 20px"
            }}
          >
            Add to Home Screen
          </button>
          <a
            style={{ color: styles.black(0.5), cursor: "pointer" }}
            onClick={() => this.handleHomeScreenReject()}
          >
            No thanks
          </a>
        </div>
      );
    };

    // still looking for user?
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
          {renderSubMenu()}
        </div>
        <Switch>
          {/* HOME */}
          <Route
            path="/"
            exact
            render={props => {
              if (user && user.groups.length) {
                return <Redirect to={"/upcoming"} />;
              }
              return (
                <Home
                  user={user}
                  updateUser={user => this.updateUser(user)}
                  styles={styles}
                />
              );
            }}
          />

          {/* Main Menu */}
          <Route
            path="/menu"
            exact
            render={props => (
              <MainMenu {...props} styles={styles} user={user} />
            )}
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

          {/* Seasons */}
          <Route
            path="/seasons"
            exact
            render={props =>
              renderAuthRoute(
                Seasons,
                props,
                user,
                this.updateUser.bind(this),
                styles
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

          {/* Current Season */}
          <Route
            path="/current"
            exact
            render={props =>
              renderAuthRoute(
                CurrentSeason,
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

          {/* Explicit landing */}
          <Route
            path="/landing"
            exact
            render={props => (
              <Home
                user={user}
                updateUser={user => this.updateUser(user)}
                styles={styles}
              />
            )}
          />
          <Route render={props => <Redirect to={"/"} />} />
        </Switch>
        {isApp ? renderAppFooter() : null}

        {/* Add to Homescreen*/}
      </div>
    );
  }
}

export default withStyles(App);

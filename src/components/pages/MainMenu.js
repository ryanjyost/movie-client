import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import LoadingScreen from "../LoadingScreen";
import Storage from "store";

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { styles, history } = this.props;
    const renderHeader = () => {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: styles.appHeaderHeight,
            position: "fixed"
          }}
        >
          <div style={{ flex: 1, color: "transparent" }}>h</div>
          <Link
            to={"/"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: styles.black(0.9),
              fontSize: 16,
              fontWeight: "bold",
              flex: 3
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
            <div
              onClick={() => history.goBack()}
              style={{
                marginRight: 15,
                color: styles.black(0.4),
                transform: "rotate(45deg)",
                fontSize: 36,
                cursor: "pointer"
              }}
            >
              +
            </div>
          </div>
        </div>
      );
    };

    const btnStyle = {
      margin: "10px 0px 10px 0px",
      backgroundColor: styles.primary(0.9),
      color: "#fff",
      fontWeight: "bold",
      padding: "6px 12px",
      textDecoration: "none",
      borderRadius: 3,
      width: 300,
      textAlign: "center",
      fontSize: 18
    };

    const url =
      "https://oauth.groupme.com/oauth/authorize?client_id=m35GLCvXufGcG7vL8243ZXNaZ8hGs9QcUoIFiNFSmeXRw3Ba";

    return (
      <div>
        {renderHeader()}
        <div
          style={{
            padding: 0,
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <a
            href={process.env.REACT_APP_GROUPME_AUTH || url}
            onClick={() => {
              Storage.set("creatingGroup", true);
            }}
            style={{
              ...btnStyle,
              ...{ backgroundColor: styles.secondary(0.9) }
            }}
            className={"hoverBtn"}
          >
            Create another group
          </a>
          <Link to={"/terms"} style={btnStyle} className={"hoverBtn"}>
            Terms of Service
          </Link>
          <Link to={"/privacy"} style={btnStyle} className={"hoverBtn"}>
            Privacy Policy
          </Link>
          <Link to={"/landing"} style={btnStyle} className={"hoverBtn"}>
            Landing Page
          </Link>
          <a
            href={"mailto:ryanjyost@gmail.com"}
            style={btnStyle}
            className={"hoverBtn"}
          >
            Contact Me
          </a>
          {this.props.user &&
            this.props.user.isAdmin && (
              <Link to={"/admin"} style={btnStyle} className={"hoverBtn"}>
                Admin
              </Link>
            )}
        </div>
      </div>
    );
  }
}

export default withRouter(MainMenu);

import React from "react";

const Rules = ({ styles }) => {
  const sectionHeaderStyle = { fontWeight: "bold", margin: "10px 0px" };
  const textStyle = {
    lineHeight: 1.4,
    color: styles.black(0.7),
    margin: "10px 0px"
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: 500,
        padding: "100px 0px",
        margin: "auto"
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: styles.primary(1),
          marginBottom: 0
        }}
      >
        How to Play
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          padding: "20px 40px",
          width: "100%"
        }}
      >
        <p style={textStyle}>
          <strong>
            Invite more friends to play via your GroupMe chat at any time.
          </strong>
        </p>
        <p style={textStyle}>
          <strong>Objective:</strong> Predict the Rotten Tomatoes Scores of
          upcoming movies more accurately than your friends.
        </p>
        <div style={textStyle}>
          <strong> All Movie Medium groups are linked to a GroupMe chat</strong>,
          where you...
          <div style={{ padding: "5px 5px 5px" }}>
            <span>...get movie and game-related updates</span>
            <br />
            <span>
              ...predict RT Scores by sending a message like “Matrix 4 = 12%”
            </span>
            <br />
            <span>...stay in touch with the players in your group</span>
          </div>
        </div>
        <p style={textStyle}>
          <strong>
            Use the app at <a href="https://moviemedium.io">moviemedium.io</a>{" "}
          </strong>to manage predictions and see more detailed game info like
          past movie results and group rankings.
        </p>
        <p style={textStyle}>
          <strong>Predictions are locked-in</strong> exactly one week before the
          release date of the movie.
        </p>

        <p style={textStyle}>
          <strong>If you forget to predict a movie</strong> before the lock-in
          deadline, you get the worst possible personal score of 100%.
        </p>
        <p style={textStyle}>
          <strong>Send a direct message to Movie Medium in GroupMe</strong> with
          any questions, ideas, bugs, stock recommendations, etc.
        </p>
      </div>
    </div>
  );
};

export default Rules;

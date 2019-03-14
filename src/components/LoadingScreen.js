import React from "react";

const LoadingScreen = ({ styles, message }) => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: styles.primary(1)
      }}
    >
      <div className="spinnerContainer">
        <div className="sp-circle" />
        <div className="spinnerImgContainer">
          <img src="android-chrome-512x512.png" width="100px" height="100px" />
        </div>
      </div>
      {message && (
        <h4 style={{ color: "rgba(255, 255, 255, 0.7)", marginTop: 30 }}>
          {message}
        </h4>
      )}
    </div>
  );
};

export default LoadingScreen;

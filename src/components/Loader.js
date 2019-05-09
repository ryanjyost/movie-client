import React from "react";

const Loader = ({ styles, message, width }) => {
  return (
    <React.Fragment>
      <div
        // className="spinnerContainer"
        style={{
          position: "relative",
          width: width,
          height: width,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          className={"sp-circle-no-style"}
          style={{
            border: `${width / 2}px rgba(85, 88, 255,1) solid`,
            borderTop: `${width / 2}px rgba(255, 255, 255,1) solid`,
            borderRadius: "50%"
          }}
        />
        <div
          style={{
            position: "absolute",
            padding: width / 8,
            zIndex: 10,
            backgroundColor: "rgba(85, 88, 255, 1)",
            borderRadius: "50%"
          }}
        >
          <img
            src="android-chrome-512x512.png"
            width={width * 0.7}
            height={width * 0.7}
          />
        </div>
      </div>
      {message && (
        <h4 style={{ color: "rgba(255, 255, 255, 0.7)", marginTop: 30 }}>
          {message}
        </h4>
      )}
    </React.Fragment>
  );
};

export default Loader;

import React from "react";
import Loader from "./Loader";

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
      <Loader styles={styles} message={message} width={150} />
    </div>
  );
};

export default LoadingScreen;

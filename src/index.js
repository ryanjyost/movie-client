import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ScrollToTop from "./components/ScrollToTop";
import * as serviceWorker from "./serviceWorker";
import { register as registerSW } from "./sw";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { withRouter } from "react-router";

const AppWithRouter = withRouter(App);

ReactDOM.render(
  <Router>
    <ScrollToTop>
      <AppWithRouter />
    </ScrollToTop>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/sw.js`).then(
      function(registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function(err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}
// if (navigator.serviceWorker.controller) {
//   // A ServiceWorker controls the site on load and therefor can handle offline
//   // fallbacks.
//   console.log(
//     navigator.serviceWorker.controller.scriptURL + " (onload)",
//     "controller"
//   );
//   console.log(
//     "An active service worker controller was found, " + "no need to register"
//   );
// } else {
//   // Register the ServiceWorker
//   navigator.serviceWorker
//     .register("sw.js", {
//       scope: "./"
//     })
//     .then(function(reg) {
//       console.log(reg.scope, "register");
//       console.log("Service worker change, registered the service worker");
//     });
// }

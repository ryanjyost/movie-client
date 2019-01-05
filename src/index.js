import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Home from "./components/Home";
import Join from "./components/Join";
import User from "./components/User";
import AddEditMovie from "./components/AddEditMovie";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/user" exact component={User} />
      <Route path="/join/:groupId" component={Join} />
      <Route path="/admin/add-new-movie" exact component={AddEditMovie} />
      <Route component={Home} />
    </Switch>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

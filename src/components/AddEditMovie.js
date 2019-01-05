import React, { Component } from "react";
import axios from "axios";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

class AddEditMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      summary: "",
      trailer: "",
      rtLink: "",
      releaseDate: moment()
    };
  }

  add() {
    axios
      .post("http://localhost:8000/movies/add", {
        title: this.state.title,
        title_lower: this.state.title.toLowerCase(),
        summary: this.state.summary,
        trailer: this.state.trailer,
        rtLink: this.state.rtLink,
        releaseDate: this.state.releaseDate.unix(),
        rtScore: -1,
        votes: null
      })
      .then(response => {
        console.log(response);
      })
      .catch(e => console.log(e));
  }

  render() {
    const renderInput = key => {
      return (
        <div style={{ width: "100%" }}>
          <FormGroup>
            <ControlLabel>{key}</ControlLabel>
            <FormControl
              type="text"
              value={this.state[key]}
              placeholder={`Enter ${key}`}
              onChange={e => this.setState({ [key]: e.target.value })}
            />
          </FormGroup>
        </div>
      );
    };
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "50px 20px",
          maxWidth: 800
        }}
      >
        {renderInput("title")}
        <div style={{ width: "100%" }}>
          <FormGroup>
            <ControlLabel>Summary</ControlLabel>
            <textarea
              className={"form-group"}
              value={this.state.summary}
              placeholder={`Summary`}
              onChange={e => this.setState({ summary: e.target.value })}
            />
          </FormGroup>
        </div>
        {renderInput("trailer")}
        {renderInput("rtLink")}
        <div style={{ width: "100%" }}>
          <FormGroup>
            <ControlLabel>Release Date</ControlLabel>
            <DateTime
              value={this.state.releaseDate}
              onChange={e => this.setState({ releaseDate: e })}
            />
          </FormGroup>
        </div>
        <Button onClick={() => this.add()}>Add movie</Button>
      </div>
    );
  }
}

export default AddEditMovie;

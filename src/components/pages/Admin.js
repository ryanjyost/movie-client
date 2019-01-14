import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  FormGroup,
  FormControl,
  ControlLabel,
  Checkbox
} from "react-bootstrap";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import ReactTable from "react-table";
import "react-table/react-table.css";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      summary: "",
      trailer: "",
      rtLink: "",
      rtScore: -1,
      releaseDate: moment(),
      isClosed: 0,

      movies: [],
      isEdit: false,
      beingEdited: {}
    };

    //"https://predict-movies-prod.herokuapp.com"/
  }

  componentDidMount() {
    axios
      .get(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/movies`
      )
      .then(response => {
        console.log(response.data);
        this.setState({ movies: response.data.movies });
      })
      .catch(e => console.log(e));
  }

  prepEdit(movie) {
    this.setState({
      title: movie.title,
      summary: movie.summary,
      trailer: movie.trailer,
      rtLink: movie.rtLink,
      rtScore: movie.rtScore,
      releaseDate: moment(movie.releaseDate * 1000),
      isClosed: "isClosed" in movie ? movie.isClosed : 0,
      isEdit: true
    });
  }

  add() {
    axios
      .post(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/movies/add`,
        {
          title: this.state.title,
          title_lower: this.state.title.toLowerCase(),
          summary: this.state.summary,
          trailer: this.state.trailer,
          rtLink: this.state.rtLink,
          releaseDate: this.state.releaseDate.unix(),
          isClosed: 0,
          rtScore: -1,
          votes: null
        }
      )
      .then(response => {
        this.setState({ movies: response.data.movies });
      })
      .catch(e => console.log(e));
  }

  edit(movie) {
    axios
      .post(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/movies/edit/${
          movie._id
        }`,
        {
          title: this.state.title,
          title_lower: this.state.title.toLowerCase(),
          summary: this.state.summary,
          trailer: this.state.trailer,
          rtLink: this.state.rtLink,
          releaseDate: this.state.releaseDate.unix(),
          isClosed: this.state.isClosed,
          rtScore: Number(this.state.rtScore)
        }
      )
      .then(response => {
        this.setState({
          movies: response.data.movies,
          isEdit: false,
          beingEdited: {}
        });
      })
      .catch(e => console.log(e));
  }

  delete(movie) {
    axios
      .post(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/movies/delete/${
          movie._id
        }`
      )
      .then(response => {
        this.setState({
          movies: response.data.movies,
          isEdit: false,
          beingEdited: {}
        });
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

    const renderTable = () => {
      const columns = [
        {
          Header: "Title",
          accessor: "title"
        },
        {
          Header: "Summary",
          accessor: "summary"
        },
        {
          Header: "Release",
          accessor: "releaseDate",
          Cell: row => {
            return moment(row.value * 1000).format("MM/DD/YYYY");
          }
        },
        {
          Header: "RT Score",
          accessor: "rtScore"
        },
        {
          Header: "Closed",
          accessor: "isClosed"
        },
        {
          Header: "Edit",
          accessor: "edit",
          Cell: props => {
            return (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  bsSize={"small"}
                  bsStyle={"primary"}
                  onClick={() => {
                    if (this.state.beingEdited[props.viewIndex]) {
                      this.setState({ beingEdited: {}, isEdit: false });
                    } else {
                      this.setState({
                        beingEdited: { [props.viewIndex]: true }
                      });
                      this.prepEdit(props.original);
                    }
                  }}
                >
                  Edit
                </Button>
              </div>
            );
          }
        }
      ];

      return (
        <ReactTable
          style={{ width: "100%", marginTop: 50 }}
          data={this.state.movies}
          columns={columns}
          filterable
          defaultFilterMethod={(filter, row, column) => {
            const id = filter.pivotId || filter.id;
            return row[id] !== undefined
              ? String(row[id])
                  .toLowerCase()
                  .includes(filter.value.toLowerCase())
              : true;
          }}
          expanded={this.state.beingEdited}
          className="-highlight"
          SubComponent={row => {
            return renderForm(true, row.original);
          }}
        />
      );
    };

    const renderForm = (isEdit, movie) => {
      return (
        <div style={{ width: "100%", padding: 20 }}>
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
          {renderInput("rtScore")}
          <Checkbox
            checked={this.state.isClosed !== 0}
            onChange={e => {
              this.setState({ isClosed: e.target.checked ? 1 : 0 });
            }}
          >
            isClosed
          </Checkbox>
          <div style={{ width: "100%" }}>
            <FormGroup>
              <ControlLabel>Release Date</ControlLabel>
              <DateTime
                value={this.state.releaseDate}
                onChange={e => this.setState({ releaseDate: e })}
              />
            </FormGroup>
          </div>
          {isEdit ? (
            <Button bsStyle={"primary"} onClick={() => this.edit(movie)}>
              Edit movie
            </Button>
          ) : (
            <Button
              bsStyle={"primary"}
              disabled={this.state.isEdit}
              onClick={() => this.add()}
            >
              Add movie
            </Button>
          )}

          {isEdit && (
            <Button
              bsStyle={"danger"}
              style={{ marginLeft: 20 }}
              onClick={() => this.delete(movie)}
            >
              Delete movie
            </Button>
          )}
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
          padding: "50px 20px"
        }}
      >
        <h1>
          {process.env.REACT_APP_API_URL ||
            "https://predict-movies-prod.herokuapp.com"}
        </h1>
        {renderForm(false)}

        {renderTable()}
      </div>
    );
  }
}

export default Admin;

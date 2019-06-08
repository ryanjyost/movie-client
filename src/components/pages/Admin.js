import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  FormGroup,
  FormControl,
  ControlLabel,
  Checkbox,
  Tabs,
  Tab
} from "react-bootstrap";
import DateTime from "react-datetime";
import { generateReleaseText, defaultFilterMethod } from "../../lib/helpers";
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
      releaseDate: moment.utc().startOf("day"),
      isClosed: 0,

      add_title: "",
      add_summary: "",
      add_trailer: "",
      add_rtLink: "",
      add_releaseDate: moment.utc().startOf("day"),

      movies: [],
      isEdit: false,
      beingEdited: {},
      moviePredictionCutoffDate: null,
      currentServerTime: null,

      messageToGroups: "",

      httpLogs: [],
      otherLogs: [],
      feedback: [],
      responding: {},
      responseText: ""
    };

    //"https://predict-movies-prod.herokuapp.com"/
  }

  getAdminLogs() {
    axios
      .get(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/admin/logs`
      )
      .then(response => {
        const { logs } = response.data;

        let httpLogs = [],
          otherLogs = [];

        for (let log of logs) {
          let jsonMessage = "";
          try {
            jsonMessage = JSON.parse(log.message);
          } catch (e) {
            jsonMessage = log.message;
          }

          if (typeof jsonMessage === "object" && "method" in jsonMessage) {
            httpLogs.push({ ...log, ...jsonMessage });
          } else {
            otherLogs.push(log);
          }
        }

        this.setState({ otherLogs, httpLogs });
      })
      .catch(e => console.log(e));
  }

  getFeedback() {
    axios
      .get(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/admin/feedback`
      )
      .then(response => {
        console.log(response.data.feedback);
        this.setState({ feedback: response.data.feedback });
      })
      .catch(e => console.log(e));
  }

  componentDidMount() {
    axios
      .get(
        `${process.env.REACT_APP_API_URL ||
          "https://predict-movies-prod.herokuapp.com"}/movies`
      )
      .then(response => {
        this.setState({
          movies: response.data.movies.reverse(),
          moviePredictionCutoffDate: response.data.moviePredictionCutoffDate,
          currentServerTime: response.data.currentTime
        });
      })
      .catch(e => console.log(e));

    this.getFeedback();
  }

  prepEdit(movie) {
    this.setState({
      title: movie.title,
      summary: movie.summary,
      trailer: movie.trailer,
      rtLink: movie.rtLink,
      rtScore: movie.rtScore,
      releaseDate: moment(movie.releaseDate * 1000).utc(),
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
          title: this.state.add_title,
          summary: this.state.add_summary,
          trailer: this.state.add_trailer,
          rtLink: this.state.add_rtLink,
          releaseDate: this.state.add_releaseDate.unix(),
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

  sendMessageToAllGroups() {
    if (window.confirm("Confirm")) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL ||
            "https://predict-movies-prod.herokuapp.com"}/admin/message/all`,
          {
            message: this.state.messageToGroups
          }
        )
        .then(response => {
          this.setState({
            messageToGroups: ""
          });
        })
        .catch(e => console.log(e));
    }
  }

  sendFeedbackResponse(feedback) {
    if (window.confirm("Confirm")) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL ||
            "https://predict-movies-prod.herokuapp.com"}/admin/feedback/${
            feedback._id
          }/respond`,
          {
            message: this.state.responseText
          }
        )
        .then(response => {
          const updatedFeedback = this.state.feedback.map(item => {
            if (item._id === response.data.response._id) {
              return response.data.response;
            } else {
              return item;
            }
          });

          this.setState({
            responding: {},
            responseText: "",
            feedback: updatedFeedback
          });
        })
        .catch(e => console.log(e));
    }
  }

  render() {
    const renderInput = (key, disabled) => {
      return (
        <div style={{ width: "100%" }}>
          <FormGroup>
            <ControlLabel>{key}</ControlLabel>
            <FormControl
              disabled={disabled}
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
          Header: "Status",
          id: "status",
          accessor: row => row,
          width: 70,
          Cell: row => {
            const movie = row.value;
            if (!movie.isClosed) {
              return (
                <div style={{ color: "#5EE137", fontWeight: "bold" }}>
                  Upcoming
                </div>
              );
            } else if (movie.isClosed && movie.rtScore < 0) {
              return (
                <div style={{ color: "#E8F132", fontWeight: "bold" }}>
                  Purgatory
                </div>
              );
            } else if (movie.rtScore > -1) {
              return (
                <div style={{ color: "#EE5F5B", fontWeight: "bold" }}>Past</div>
              );
            } else {
              return (
                <div style={{ color: "#EE5F5B", fontWeight: "bold" }}>
                  Error
                </div>
              );
            }
          },
          filterMethod: (filter, row) => {
            const movie = row._original;
            let text = "";
            if (!movie.isClosed) {
              text = "Upcoming";
            } else if (movie.isClosed && movie.rtScore < 0) {
              text = "Purgatory";
            } else if (movie.rtScore > -1) {
              text = "Past";
            } else {
              text = "Error";
            }

            return movie !== undefined
              ? text.toLowerCase().includes(filter.value.toLowerCase())
              : false;
          }
        },
        {
          Header: "Score",
          accessor: "rtScore",
          width: 50,
          style: { textAlign: "center", fontWeight: "bold" },
          Cell: row => (row.value < 0 ? "" : row.value)
        },
        {
          Header: "Title",
          accessor: "title",
          width: 200,
          Cell: row => {
            return (
              <a href={row.original.rtLink} target={"_blank"}>
                {row.value}
              </a>
            );
          }
        },
        {
          Header: "Season",
          accessor: "season",
          width: 50,
          style: { textAlign: "center" },
          Cell: row => row.value || null
        },
        {
          Header: "Countdown",
          id: "countdown",
          accessor: row => row,
          width: 100,
          Cell: row => {
            if (
              row.value &&
              !row.value.isClosed &&
              this.state.moviePredictionCutoffDate
            ) {
              return generateReleaseText(
                row.value.releaseDate,
                this.state.moviePredictionCutoffDate
              );
            } else {
              return "";
            }
          }
        },
        {
          Header: "Release",
          accessor: "releaseDate",
          width: 80,
          Cell: row => {
            return moment(row.value * 1000)
              .utc()
              .format("MM/DD/YYYY");
          }
        },
        {
          Header: "Created",
          accessor: "created_at",
          width: 80,
          Cell: row => {
            return moment(row.value)
              .utc()
              .format("MM/DD/YYYY");
          }
        },
        {
          Header: "Edit",
          accessor: "edit",
          width: 60,
          Cell: props => {
            return (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <a
                  style={{ cursor: "pointer" }}
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
                </a>
              </div>
            );
          }
        }
      ];

      return (
        <ReactTable
          style={{ width: "100%" }}
          data={this.state.movies}
          columns={columns}
          defaultPageSize={100}
          filterable
          defaultFilterMethod={defaultFilterMethod}
          expanded={this.state.beingEdited}
          className="-highlight"
          SubComponent={row => {
            return renderForm(true, row.original);
          }}
        />
      );
    };

    const renderLogs = () => {
      const columns = [
        {
          Header: "Timestamp",
          id: "timestamp",
          accessor: row =>
            moment(row.timestamp, "MM/DD/YYYY, H:mm:ss Z").unix(),
          width: 160,
          Cell: row => row.original.timestamp.split("+")[0]
        },
        {
          Header: "Level",
          id: "level",
          accessor: "level",
          width: 50
        },
        {
          Header: "Message",
          id: "message",
          accessor: "message"
        }
      ];

      return (
        <ReactTable
          style={{ width: "100%" }}
          data={this.state.otherLogs}
          columns={columns}
          defaultPageSize={100}
          filterable
          defaultFilterMethod={defaultFilterMethod}
          className="-highlight"
        />
      );
    };

    const renderHttpLogs = () => {
      const columns = [
        {
          Header: "Timestamp",
          id: "timestamp",
          accessor: row =>
            moment(row.timestamp, "MM/DD/YYYY, H:mm:ss Z").unix(),
          width: 160,
          Cell: row => row.original.timestamp.split("+")[0]
        },
        {
          Header: "Status",
          id: "status",
          accessor: "status",
          width: 50
        },
        {
          Header: "Method",
          id: "method",
          accessor: "method",
          width: 60
        },
        {
          Header: "URL",
          id: "url",
          accessor: "url",
          width: 300
        },
        {
          Header: "Response",
          id: "responseTime",
          accessor: row => Math.ceil(Number(row.responseTime)),
          width: 100,
          Cell: row => `${row.value.toFixed(0)} ms`
        },
        {
          Header: "Content",
          id: "contentLength",
          accessor: row => Math.ceil(Number(row.contentLength * 0.001)),
          width: 100,
          Cell: row => `${row.value.toFixed(0)} kb`
        }
      ];

      return (
        <ReactTable
          style={{ width: "100%" }}
          data={this.state.httpLogs}
          columns={columns}
          defaultPageSize={100}
          filterable
          defaultFilterMethod={defaultFilterMethod}
          className="-highlight"
        />
      );
    };

    const renderForm = (isEdit = true, movie) => {
      return (
        <div style={{ width: "100%", padding: 20, maxWidth: 500 }}>
          {renderInput("title")}
          <div style={{ width: "100%" }}>
            <FormGroup style={{ marginBottom: 0 }}>
              <ControlLabel>Summary</ControlLabel>
              <textarea
                style={{
                  width: "100%",
                  border: "1px solid #d8d8d8",
                  borderRadius: 3
                }}
                className={"form-group"}
                value={this.state.summary}
                placeholder={`Summary`}
                onChange={e => this.setState({ summary: e.target.value })}
              />
            </FormGroup>
          </div>
          {renderInput("trailer")}
          {renderInput("rtLink")}
          {renderInput("rtScore", !this.state.isClosed)}
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
              <ControlLabel>Release Date (UTC)</ControlLabel>
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

    const renderAddForm = () => {
      return (
        <div style={{ width: "100%", padding: 20, maxWidth: 500 }}>
          {renderInput("add_title")}
          <div style={{ width: "100%" }}>
            <FormGroup style={{ marginBottom: 0 }}>
              <ControlLabel>Summary</ControlLabel>
              <textarea
                style={{
                  width: "100%",
                  border: "1px solid #d8d8d8",
                  borderRadius: 3
                }}
                className={"form-group"}
                value={this.state.add_summary}
                placeholder={`Summary`}
                onChange={e => this.setState({ add_summary: e.target.value })}
              />
            </FormGroup>
          </div>
          {renderInput("add_trailer")}
          {renderInput("add_rtLink")}
          {/*{renderInput("rtScore", !this.state.isClosed)}*/}
          {/*<Checkbox*/}
          {/*checked={this.state.isClosed !== 0}*/}
          {/*onChange={e => {*/}
          {/*this.setState({ isClosed: e.target.checked ? 1 : 0 });*/}
          {/*}}*/}
          {/*>*/}
          {/*isClosed*/}
          {/*</Checkbox>*/}
          <div style={{ width: "100%" }}>
            <FormGroup>
              <ControlLabel>Release Date (UTC)</ControlLabel>
              <DateTime
                value={this.state.add_releaseDate}
                onChange={e => this.setState({ add_releaseDate: e })}
              />
            </FormGroup>
          </div>

          <Button bsStyle={"primary"} onClick={() => this.add()}>
            Add movie
          </Button>
        </div>
      );
    };

    const groupMessage = () => {
      return (
        <div
          style={{
            width: "100%",
            padding: 20
          }}
        >
          <div style={{ width: "100%", padding: "10px 0px" }}>
            <textarea
              style={{
                width: "100%",
                border: "1px solid #d8d8d8",
                borderRadius: 3
              }}
              value={this.state.messageToGroups}
              onChange={e => this.setState({ messageToGroups: e.target.value })}
              rows={10}
            />
          </div>
          <Button
            disabled={!this.state.messageToGroups.length}
            bsStyle="primary"
            onClick={() => this.sendMessageToAllGroups()}
          >
            Send
          </Button>
        </div>
      );
    };

    const renderFeedback = () => {
      const renderRespondToFeedbackForm = feedback => {
        return (
          <div
            style={{
              width: "100%",
              padding: 20
            }}
          >
            <div style={{ width: "100%", padding: "10px 0px" }}>
              <textarea
                style={{
                  width: "100%",
                  border: "1px solid #d8d8d8",
                  borderRadius: 3
                }}
                value={this.state.responseText}
                onChange={e => this.setState({ responseText: e.target.value })}
                rows={5}
              />
            </div>
            <Button
              disabled={!this.state.responseText.length}
              bsStyle="primary"
              onClick={() => this.sendFeedbackResponse(feedback)}
            >
              Send
            </Button>
          </div>
        );
      };

      const columns = [
        {
          Header: "Message",
          id: "message",
          style: { fontSize: 10, display: "flex", alignItems: "center" },
          accessor: "message",
          width: 200
        },
        {
          Header: "Members",
          id: "members",
          style: { fontSize: 10, display: "flex", alignItems: "center" },
          accessor: row => {
            const members = [...row.group.members];
            let text = "";
            for (let member of members) {
              if (!member.isMM) {
                text = text + member.name + ", ";
              }
            }

            return text;
          },
          width: 200,
          Cell: row => {
            return row.value;
          }
        },
        {
          Header: "Created",
          id: "timestamp",
          width: 140,
          style: { fontSize: 10, display: "flex", alignItems: "center" },
          accessor: row => row.payload.created_at,
          Cell: row => moment.unix(row.value).format("MM/DD/YYYY, h:mm: a Z")
        },
        {
          Header: "Response",
          accessor: "respond",
          width: 300,
          Cell: row => {
            if (row.original.response) {
              return (
                <span style={{ fontSize: 10 }}>{row.original.response}</span>
              );
            } else {
              return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (this.state.responding[row.viewIndex]) {
                        this.setState({ responding: {} });
                      } else {
                        this.setState({
                          responding: { [row.viewIndex]: true }
                        });
                      }
                    }}
                  >
                    Respond
                  </a>
                </div>
              );
            }
          }
        },
        {
          Header: "Go to Chat",
          accessor: "chatLink",
          id: "chatLink",
          filterable: false,
          sortable: false,
          width: 100,
          Cell: row => {
            return (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <a
                  target={"_blank"}
                  style={{ cursor: "pointer" }}
                  href={`https://app.groupme.com/chats/${
                    row.original.payload.group_id
                  }`}
                >
                  Go to chat
                </a>
              </div>
            );
          }
        }
      ];

      return (
        <ReactTable
          style={{ width: "100%" }}
          data={this.state.feedback}
          columns={columns}
          defaultPageSize={100}
          filterable
          expanded={this.state.responding}
          defaultFilterMethod={defaultFilterMethod}
          className="-highlight"
          SubComponent={row => {
            return renderRespondToFeedbackForm(row.original);
          }}
          getTrProps={(thing, row) => {
            if (!row) return {};
            return {
              style: {
                backgroundColor: row.original.response
                  ? null
                  : "rgba(94, 225, 55, 0.1)"
              }
            };
          }}
        />
      );
    };

    const renderEnv = () => {
      if (
        process.env.REACT_APP_API_URL ===
        "https://predict-movies-prod.herokuapp.com"
      ) {
        return <h1 style={{ color: "#EE5F5B" }}>Production</h1>;
      } else {
        const isStaging =
          process.env.REACT_APP_API_URL ===
          "https://predict-movies-staging.herokuapp.com";
        return <h1>{isStaging ? "Staging" : "Development"}</h1>;
      }
    };

    const tabStyle = {
      backgroundColor: "#fff",
      padding: 20,
      border: "1px solid #e5e5e5",
      borderTop: 0
    };

    return (
      <div
        style={{
          width: "100%",
          // display: "flex",
          // flexDirection: "column",
          // alignItems: "center",
          padding: "50px 20px"
        }}
      >
        {renderEnv()}
        <div style={{ padding: 5 }}>
          <h5 style={{ marginBottom: 5 }}>
            <strong>Current Time </strong>
            {moment().format("dddd, MMMM Do YYYY, h:mm:ss a Z")}
          </h5>
          <h5>
            <strong>Server Time </strong>
            {this.state.currentServerTime
              ? moment
                  .unix(this.state.currentServerTime)
                  .utc()
                  .format("dddd, MMMM Do YYYY, h:mm:ss a Z")
              : null}
          </h5>
        </div>
        <Tabs
          onSelect={key => {
            if (
              (key === "logs" || key === "httpLogs") &&
              !this.state.httpLogs.length
            ) {
              this.getAdminLogs();
            }

            if (key === "feedback") {
              this.getFeedback();
            }

            return key;
          }}
          defaultActiveKey={"feedback"}
          id={"tabs"}
          transition={"false"}
          mountOnEnter={true}
          style={{ width: "100%", maxWidth: 1200, marginTop: 20 }}
        >
          <Tab eventKey={"movies"} title="Movies" style={tabStyle}>
            {renderTable()}
          </Tab>
          <Tab eventKey={"addMovie"} title="Add Movie" style={tabStyle}>
            {renderAddForm()}
          </Tab>
          <Tab eventKey={"feedback"} title="Feedback" style={tabStyle}>
            {renderFeedback()}
          </Tab>
          <Tab
            eventKey={"groupMessage"}
            title="Message Groups"
            style={tabStyle}
          >
            {groupMessage()}
          </Tab>
          <Tab eventKey={"logs"} title="Logs" style={tabStyle}>
            {renderLogs()}
          </Tab>
          <Tab eventKey={"httpLogs"} title="HTTP Logs" style={tabStyle}>
            {renderHttpLogs()}
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default Admin;

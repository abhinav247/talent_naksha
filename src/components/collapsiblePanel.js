import React, { Component } from "react";
import { PanelGroup, Panel } from "react-bootstrap";
import { get, map, find, reduce } from "lodash";
import { Grid, Col, Row } from "react-bootstrap";
import { defaultEvent } from "../actions/jobs.action";
import addIcon from "../assets/img/Group 12.png";
import {
  newEvent,
  updateJob,
  updateField,
  updateEventField,
  addEvents,
  updateEvent,
  deleteJob
} from "../actions/jobs.action";
import { connect } from "react-redux";
import threeDotMenu from "../assets/img/Group 3.png";
import {
  getJobStatus,
  spentDays,
  getJobSignal,
  getEventColor,
  getstatusAndDelays,
  getEventTotalSLa,
  getJobSummary
} from "./utils";
import moment from "moment";

class Clock extends React.Component {
  constructor(props) {
    super(props);
    const { job_startDate } = this.props;
    this.state = {
      startTime: this.setStartTime(job_startDate)
    };
  }

  setStartTime(job_startDate) {
    let now = moment();
    return moment.duration(now.diff(job_startDate)).asMinutes();
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.tick();
    }, 0);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    const { job_startDate } = this.props;
    const now = moment();
    this.setState({
      startTime: moment.duration(now.diff(job_startDate)).asMinutes()
    });
  }

  render() {
    return <span>{Math.floor(this.state.startTime)}</span>;
  }
}

class ControlledPanelGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.jobTable,
      expandedRows: [],
      open: false,
      value: "",
      showJobMenu: false,
      jobTobeDeleted: "",
      eventColor: "in-progress"
    };
    this.onChange = this.onChange.bind(this);
    this.editField = this.editField.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.openPanel = this.openPanel.bind(this);
    this.closePanel = this.closePanel.bind(this);
    this.completeEvent = this.completeEvent.bind(this);
    this.jobAction = this.jobAction.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  jobAction(e, action, rowId) {
    const { deleteJob } = this.props;
    if (action === "Delete") {
      deleteJob(rowId);
    }
  }

  openPanel(jobId) {
    this.setState({ showJobMenu: true, jobTobeDeleted: jobId });
  }

  closePanel() {
    this.setState({ showJobMenu: false });
  }

  setEventColor(event) {
    this.setState({
      eventColor: getEventColor(event),
      closedEventId: event._id
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.jobTable !== nextProps.jobTable)
      this.setState({ data: nextProps.jobTable });
  }

  addEvent(rowId, row) {
    const { job_sla, eventList } = row;

    let totalEventTime = getEventTotalSLa(eventList);

    if (totalEventTime + defaultEvent.event_sla > job_sla) {
      alert("Adding Event will Cross Job SLa");
    } else {
      const { addEvents } = this.props;
      addEvents(rowId);
    }
  }

  componentWillMount() {
    document.addEventListener("mousedown", this.handleClick, false);
  }

  onChange(id, field, value) {
    const { data } = this.state;

    const { updateField, updateEventField } = this.props;
    if (["event_description", "event_sla"].includes(field)) {
      if (field === "event_sla") {
        let currentJob = find(data, job => {
          return find(job.eventList, event => {
            return event._id === id;
          });
        });
        let totalEventTime = getEventTotalSLa(currentJob.eventList, id);

        if (totalEventTime + parseInt(value) >= currentJob.job_sla) {
          alert("This value should be less than the total sla");
        } else {
          updateEventField(id, field, value);
        }
      } else {
        updateEventField(id, field, value);
      }
    } else {
      updateField(id, field, value);
    }

    this.setState({ updatedValue: value });
  }

  componentWillUnMount() {
    document.removeEventListener("mousedown", this.handleClick, false);
  }

  handleClick(e) {
    const { fieldEditing } = this.state;
    if (this[fieldEditing] && this[fieldEditing].contains(e.target)) {
      return;
    } else {
      this.saveChanges();
    }

    if (this.action && this.action.contains(e.target)) {
      return;
    } else {
      this.setState({ showJobMenu: false, jobTobeDeleted: "" });
    }
  }

  handleRowClick(rowId) {
    const currentExpandedRows = this.state.expandedRows;
    const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

    const newExpandedRows = isRowCurrentlyExpanded
      ? currentExpandedRows.filter(_id => _id !== rowId)
      : currentExpandedRows.concat(rowId);

    this.setState({ expandedRows: newExpandedRows });
  }

  editField(e, field, row) {
    this.setState({
      fieldEditing: e.target.id,
      controlId: row._id,
      field: field
    });
  }

  completeEvent(event, jobId) { 
    
    const {event_status,event_signal,event_actualEndDate}=event;
    
    const isEventClosed = event_status==='Closed'?true:false

    let content = {
      event_status: isEventClosed?'started':'Closed',
      event_signal: isEventClosed?'in-progress':getEventColor(event)
    };


    const { updateEvent } = this.props;
    updateEvent(event._id, { jobId, ...content });
  }

  RenderEvents(row) {
    const { fieldEditing } = this.state;
    const { eventList, _id } = row;

    const renderevent = (event, slaid) => {
      const { event_status } = event;
     
      // alert(moment(event.event_endDate).format('MMMM Do YYYY, h:mm:ss a'))
      return (
        <div className="sla_event">
          {this.getComponent(
            event,
            "event_description",
            fieldEditing,
            `event_description_${_id}_${slaid}`,
            "event_description"
          )}
          {this.getComponent(
            event,
            "event_sla",
            fieldEditing,
            `event_sla${_id}_${slaid}`,
            "event_sla"
          )}
          <button
            className={`sla_button ${event.event_signal}`}
            onClick={() => {
              this.completeEvent(event, _id, event);
            }}
          />
        </div>
      );
    };

    return (
      <div className="job_events">
        {map(eventList, (event, index) => {
          return renderevent(event, index);
        })}
      </div>
    );
  }

  RenderJobDescription(row) {
    const { fieldEditing } = this.state;
    const { events, _id, job_sla } = row;
    const statusAndDelays = getstatusAndDelays(row.eventList);
    const JobSummary = getJobSummary(row.eventList);
    return (
      <div id={_id} className=" row show-grid">
        <div className="col-md-4">
          <label name="Job Description">Job Description</label>
          {this.getComponent(
            row,
            "job_description",
            fieldEditing,
            `job_description_${_id}`,
            "job__description"
          )}
        </div>
        <div className="col-md-8">
          <label>SLA Events</label>
          <div className="row">
            <div className="col-md-6">{this.RenderEvents(row)}</div>
            <div className="col-md-6">
              <img
                className="add__event"
                src={addIcon}
                onClick={() => {
                  this.addEvent(_id, row);
                }}
              />
            </div>
          </div>
          <div className="job__report row">
            <div className="col-md-6">
              <label>Job Summary</label>
              <div className="days_spent">
                <div className="events__details">
                  <label>Days Remaining</label>
                  <span>{job_sla - spentDays(row)} Days</span>
                </div>
                <div className="events__details">
                  <label>Delays if any</label>
                  <span>{get(JobSummary, "delays")}</span>
                </div>
                <div className="events__details">
                  <label>Before Time </label>
                  <span>{get(JobSummary, "beforeTime")}</span>
                </div>
                <div className="events__details">
                  <label>On Time</label>
                  <span>{get(JobSummary, "onTime")}</span>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <label>Status</label>
              <div className="job_status">
                <div className="events__details">
                  <label>On Track Since</label>
                  <span>0</span>
                </div>
                <div className="events__details">
                  <label>Events Before Time</label>
                  <span>{get(statusAndDelays, "beforeTime")}</span>
                </div>
                <div className="events__details">
                  <label>Events On Time</label>
                  <span>{get(statusAndDelays, "onTime")}</span>
                </div>
                <div className="events__details">
                  <label>Events Delayed</label>
                  <span>{get(statusAndDelays, "delays")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  saveChanges() {
    const { fieldEditing, controlId, field, updatedValue, data } = this.state;
    const { updateJob, updateEvent } = this.props;
    if (this[fieldEditing]) {
      if (updatedValue !== "") {
        if (["event_description", "event_sla"].includes(field)) {
          let currentJob = find(data, job => {
            return find(job.eventList, event => {
              return event._id === controlId;
            });
          });
          if (field === "event_sla") {
            let eventIndex = currentJob.eventList.findIndex(
              event => event._id == controlId
            );
            let content = {
              jobId: currentJob._id,
              eventIndex,
              field,
              updatedValue
            };

            updateEvent(controlId, content);
          } else {
            updateEvent(controlId, {
              jobId: currentJob._id,
              [field]: updatedValue
            });
          }
        } else {
          updateJob(controlId, field, updatedValue);
        }
      }
    }

    this.setState({
      fieldEditing: "",
      controlId: "",
      field: "",
      updatedValue: ""
    });
  }

  _handleKeyPress(e) {

    if (e.key === "Enter") {
      this.saveChanges();
    }
  }

  getComponent(row, field, fieldEditing, controlId, classname) {
    const { event_status } = row;
    const self = this;
    if (fieldEditing !== "" && fieldEditing === controlId) {
      switch (field) {
        case "job_description":
          return (
            <textarea
              ref={node => (this[controlId] = node)}
              className={classname}
              name={field}
              onChange={e => {
                this.onChange(row._id, field, e.target.value);
              }}
             
              value={row[field]}
            />
          );
          break;

        default:
          return (
            <input
              ref={node => (this[controlId] = node)}
              name={field}
              value={row[field]}
              onChange={e => {
                this.onChange(row._id, field, e.target.value);
              }}
             
            />
          );
      }
    }

    switch (field) {
      case "job_description":
        return (
          <p
            className={classname ? classname : ""}
            id={controlId}
            onClick={e => {
              self.editField(e, field, row);
            }}
          >
            {row[field]}
          </p>
        );

      default:
        return (
          <span
            className={classname ? classname : ""}
            id={controlId}
            onClick={e => {
              if (event_status === undefined) {
                self.editField(e, field, row);
              }
              if (event_status !== undefined && event_status === "started") {
                self.editField(e, field, row);
              }
            }}
          >
            {row[field]}
          </span>
        );
    }
  }

  renderItem(item) {
    const { fieldEditing, showJobMenu, jobTobeDeleted } = this.state;
    const clickCallback = () => this.handleRowClick(item._id);
    const jobStatus = getJobStatus(item);
    const jobSignal = getJobSignal(item);
    const job = item;
    const renderClock = job => {
      if (job.eventList.length > 0) return true;

      return false;
    };

    const getSignalClass = Signal => {
      switch (jobSignal) {
        case "On Track":
          return "on-track";
        case "Before Time":
          return "before-time";
        case "Delayed":
          return "delayed";

        default:
          break;
      }
    };

    const itemRows = [
      <tr
        key={"row-data-" + item._id}
        className={
          this.state.expandedRows.includes(item._id) ? "active" : "item-row"
        }
      >
        <td onClick={clickCallback}>(+)</td>
        <td>
          {this.getComponent(
            item,
            "job_title",
            fieldEditing,
            `job_title_${item._id}`,
            ""
          )}
        </td>
        <td>
          {this.getComponent(
            item,
            "job_sla",
            fieldEditing,
            `job_sla_${item._id}`,
            ""
          )}
        </td>
        <td
          className={
            jobStatus === "In-Progress" ? "job-status inprogress" : "job-status"
          }
        >
          {jobStatus}
        </td>
        <td>
          {renderClock(item) ? <Clock job_startDate={item.job_startDate} /> : 0}
        </td>
        <td className={`job-signal ${getSignalClass(jobSignal)} `}>
          {jobSignal}
        </td>
        <td
          onClick={() => {
            this.openPanel(job._id);
          }}
        >
          <img style={{ backgroundColor: "#3c3c3c" }} src={threeDotMenu} />

          {(() => {
            if (jobTobeDeleted === job._id) {
              return (
                <div
                  ref={node => (this.action = node)}
                  className="three-dotMenu"
                  style={{ display: showJobMenu ? "block" : "none" }}
                >
                  {["Delete"].map(item => {
                    return (
                      <div
                        className="job-action"
                        onClick={e => {
                          this.jobAction(e, item, jobTobeDeleted);
                        }}
                      >
                        <span>{item}</span>
                      </div>
                    );
                  })}
                </div>
              );
            }
          })()}
        </td>
      </tr>
    ];

    if (this.state.expandedRows.includes(item._id)) {
      itemRows.push(
        <tr key={"row-expanded-" + item._id} className="row__expanded">
          <td colspan={6}>{this.RenderJobDescription(item)}</td>
        </tr>
      );
    }

    return itemRows;
  }

  render() {
    let allItemRows = [];

    let sortedArray = this.state.data.sort(function compare(a, b) {
      var dateA = new Date(a.job_entryDate);
      var dateB = new Date(b.job_entryDate);
      return dateB - dateA;
    });

    sortedArray.forEach(item => {
      const perItemRows = this.renderItem(item);
      allItemRows = allItemRows.concat(perItemRows);
    });

    return (
      <table>
        <thead>
          <tr>
            <th>(+)</th>
            <th>Job Title</th>
            <th>SLA</th>
            <th>Status</th>
            <th>Days Spent</th>
            <th>Signal</th>
            <th />
          </tr>
        </thead>
        <tbody>{allItemRows}</tbody>
      </table>
    );
  }
}

export default connect(
  null,
  {
    updateJob,
    updateField,
    addEvents,
    updateEvent,
    deleteJob,
    updateEventField
  }
)(ControlledPanelGroup);

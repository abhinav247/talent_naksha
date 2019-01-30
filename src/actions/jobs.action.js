import {uniqueId} from 'lodash';
import {
  NEW_JOB,
  NEW_EVENT,
  GET_ALL_JOBS,
  UPDATE_JOB,
  UPDATE_FIELD,
  UPDATE_EVENT_FIELD
} from '../actions/actionTypes';
import {beginAjaxCall, endAjaxCall} from './ajaxstatus.action';
import moment from 'moment';
import {get} from 'lodash';

export const defaultEvent = {
  event_description: 'uploading Resume',
  event_sla: 1,
  event_signal:'in-progress',
  event_status: 'started',
};

export const defaultJob = {
  job_title: 'UX/UI Developer',
  job_sla: 30,
  job_status: 'Open',
  job_signal: 'On Track',
  job_description: `Candidate should have experience in following :

  1) Java (J2EE)
  2) Experience in any framework (Spring, Spring Boot is preferred)
  3) Should know about REST APIs
  4) Good knowledge about JS framework (Angular is preferred) &amp; front end technologies
  5) Familiarity with database is good to have (MySQL, Oracle or any)
  6) AWS Infrastructure knowledge will be plus
  7) Interest in Visualization and UI/Ux
  8) Wire framing to going live and understanding the functionality layout to code
  9) Should have zeal to learn and capacity to implement tasks within strict deadlines`,
  eventList: []
};


let url = 'http://ec2-13-233-158-190.ap-south-1.compute.amazonaws.com:5002'
// let url ='http://localhost:5002';
export const postResource = (url, content) => {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify (content),
  };

  return fetch (url, requestOptions).then (res => {
    return res.json ();
  });
};

export const getResource = url => {
  const requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  };

  return fetch (url, requestOptions).then (res => {
    return res.json ();
  });
};

export const deleteResource = url => {
  const requestOptions = {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
  };

  return fetch (url, requestOptions).then (res => {
    return res.json ();
  });
};

export const putResource = (url, content) => {
  const requestOptions = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify (content),
  };
  return fetch (url, requestOptions)
    .then (function success (resp) {
      return resp.json ();
    })
    .catch (function (error) {
      // If there is any error you will catch them here
    });
};

export const addjob = () => dispatch => {
  dispatch (beginAjaxCall ());
  postResource (`${url}/postjob`, defaultJob)
    .then (res => {
      dispatch (endAjaxCall ());
      dispatch (JobAdded (get (res, 'data')));
    })
    .catch (error => {
      console.log (error);
    });
};

export const deleteJob = (jobid) => dispatch => {
  dispatch (beginAjaxCall ());
  deleteResource (`${url}/delete/${jobid}`).then (res => {
    dispatch (alljobs (get (res, 'data')));
    dispatch (endAjaxCall ());
  });
};

export const getAllJobs = () => dispatch => {
  dispatch (beginAjaxCall ());
  getResource (`${url}/jobs`).then (res => {
    dispatch (alljobs (get (res, 'jobs')));
    dispatch (endAjaxCall ());
  });
};

export const updateJob = (jobId, field, value) => dispatch => {
  dispatch (beginAjaxCall ());
  putResource (`${url}/job/${jobId}`, {[field]: value}).then (res => {
    dispatch (jobUpdated (get (res, 'data')));
    dispatch (endAjaxCall ());
  });
};

export const updateEvent = (eventId, content) => dispatch => {
  dispatch (beginAjaxCall ());
  putResource (`${url}/updateEvent/${eventId}`, content).then (res => {
    dispatch (jobUpdated (get (res, 'data')));
    dispatch (endAjaxCall ());
  });
};

// const eventUpdated=data=>{return {type:EVENT_UPDATED,data} }

export const addEvents = id => dispatch => {
  dispatch (beginAjaxCall ());

  let now = moment()
  let endDate= now.add(defaultEvent.event_sla-1, 'minutes');

  postResource (`${url}/event`, {jobid: id, ...defaultEvent}).then (res => {
    dispatch (jobUpdated (get (res, 'data')));
    dispatch (endAjaxCall ());
  });
};
const alljobs = data => {
  return {type: GET_ALL_JOBS, data};
};

export const updateField = (rowId, field, value) => {
  return {type: UPDATE_FIELD, rowId, field, value};
};


export const updateEventField= (eventId, field,value) =>{
  return {type:UPDATE_EVENT_FIELD,eventId,field,value}
}

export const newEvent = id => dispatch => {
  dispatch (eventAdded (id, defaultEvent));
};

const jobUpdated = data => {
  return {type: UPDATE_JOB, data};
};

const eventAdded = (id, data) => {
  return {type: NEW_EVENT, data, id};
};

const JobAdded = data => {
  return {type: NEW_JOB, data};
};

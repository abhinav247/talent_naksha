import { NEW_JOB, NEW_EVENT, GET_ALL_JOBS,UPDATE_JOB,UPDATE_FIELD,UPDATE_EVENT_FIELD } from "../actions/actionTypes";

const initialState = {
  jobs: []
};

export default function jobdetail(state = initialState, action) {
  switch (action.type) {
    case NEW_JOB:
      return {
        jobs: [...state.jobs, action.data]
      };
    case GET_ALL_JOBS:
      return {
        jobs: action.data
      };

    

    case UPDATE_JOB:
      return {
        jobs: [
          ...state.jobs.map(job => {
            if (job._id === action.data._id) {
              return action.data
            }
            return job
          })
        ]
      };

    case UPDATE_EVENT_FIELD:
       return {
         jobs:[
           ...state.jobs.map(job=>{
              return {
                ...job,
                eventList:[
                  ...job.eventList.map(event=>{
                    if(event._id===action.eventId){
                        return {
                        ...event,
                          [action.field]:action.value
                        }
                      }
                    return event
                  })
                ]
              }
           })
         ]
       }
    case UPDATE_FIELD:
        return {
          ...state,
        jobs: [
          ...state.jobs.map(job => {
            if (job._id === action.rowId) {
              return {
                ...job,
                [action.field]:action.value
              };
            }
            return job;
          })
        ]
        }
    case NEW_EVENT:
      return {
        ...state,
        jobs: [
          ...state.jobs.map(job => {
            if (job._id === action._id) {
              return {
                ...job,
                events: [...job.events, action.data]
              };
            }
            return job;
          })
        ]
      };
    default:
      return { ...state };
  }
}

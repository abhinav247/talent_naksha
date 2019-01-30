import {map, reduce} from 'lodash';
import moment from 'moment';

export const spentDays = (job, field) => {
  const {job_startDate, eventList} = job;

  if (eventList.length === 0) return 0;

  let now = moment ();
  let duration = moment.duration (now.diff (job_startDate));
  return Math.floor (duration.asMinutes ());
};

export const getstatusAndDelays = events => {
  let delays = 0, beforeTime = 0, onTime = 0;
  delays = reduce (
    events,
    (delays, value, key) => {
      const {event_sla, event_endDate, event_status} = value;

      if (event_status !== 'Closed') {
        const now = moment ();
        if (
          moment.duration (now.diff (moment (event_endDate))).asMinutes () > 0
        ) {
          ++delays;
        }
      }
      return delays;
    },
    delays
  );
  beforeTime = reduce (
    events,
    (beforeTime, value, key) => {
      const {event_sla, event_endDate, event_status} = value;

      if (event_status !== 'Closed') {
        const now = moment ();
        if (
          moment.duration (now.diff (moment (event_endDate))).asMinutes () < 0
        ) {
          ++beforeTime;
        }
      }
      return beforeTime;
    },
    beforeTime
  );
  onTime = reduce (
    onTime,
    (delays, value, key) => {
      const {event_sla, event_endDate, event_status} = value;

      if (event_status !== 'Closed') {
        const now = moment ();
        if (
          moment.duration (now.diff (moment (event_endDate))).asMinutes () === 0
        ) {
          ++onTime;
        }
      }
      return onTime;
    },
    onTime
  );

  return {
    delays,
    beforeTime,
    onTime,
  };
};

export const getJobSummary = events => {
  let delays = 0, beforeTime = 0, onTime = 0;
  delays = reduce (
    events,
    (delays, value, key) => {
      const {event_signal, event_status} = value;

      if (event_status === 'Closed') {
        if (event_signal === 'delayed') {
          ++delays;
        }
      }
      return delays;
    },
    delays
  );
  beforeTime = reduce (
    events,
    (beforeTime, value, key) => {
      const {event_signal, event_status} = value;

      if (event_status === 'Closed') {
        if (event_signal === 'before-time') {
          ++beforeTime;
        }
      }
      return beforeTime;
    },
    beforeTime
  );
  onTime = reduce (
    events,
    (onTime, value, key) => {
      const {event_signal, event_status} = value;

      if (event_status === 'Closed') {
        if (event_signal === 'on-track') {
          ++onTime;
        }
      }
      return onTime;
    },
    onTime
  );

  return {
    delays,
    beforeTime,
    onTime,
  };
};

export const getEventColor = event => {
  const {event_status, event_actualEndDate, event_endDate, event_sla} = event;
  let now = moment ();
  var eventDuration = moment
    .duration (now.diff (moment (event_endDate)))
    .asMinutes ();

  if (eventDuration < 0) {
    return 'before-time';
  } else if (eventDuration > 0) {
    return 'delayed';
  } else if (eventDuration === 0) {
    return 'on-track';
  }
};

export const getJobSignal = job => {
  const {eventList} = job;
  let currentJob = '';
  if (eventList.length > 0) {
    let ClosedEvents = 0;

    ClosedEvents = reduce (
      eventList,
      (CloseEvent, value, key) => {
        const {event_status} = value;
        if (event_status === 'Closed') {
          ++ClosedEvents;
        }
        return ClosedEvents;
      },
      ClosedEvents
    );

    if (ClosedEvents !== eventList.length) {
      for (let index = 0; index < eventList.length; index++) {
        const element = eventList[index];
        const {event_status} = element;
        if (event_status === 'started') {
          currentJob = element;
          break;
        }
      }

      const {event_endDate} = currentJob;
      const now = moment ();
      if (
        moment.duration (now.diff (moment (event_endDate))).asMinutes () > 0
      ) {
        return 'Delayed';
      } else if (
        moment.duration (now.diff (moment (event_endDate))).asMinutes () < 0
      ) {
        return 'Before Time';
      }
      if (
        moment.duration (now.diff (moment (event_endDate))).asMinutes () == 0
      ) {
        return 'On Track';
      }
    } else if (ClosedEvents === eventList.length) {
      let lastEvent = eventList[eventList.length - 1];
      const {event_signal} = lastEvent;

      switch (event_signal) {
        case 'before-time':
          return 'Before Time';
          break;
        case 'delayed':
          return 'Delayed';
          break;
        case 'on-track':
          return 'On Track';
          break;
      }
    }
  }
  return 'On Track';
};

export const getJobStatus = job => {
  const {eventList} = job;
  const eventsCount = eventList.length;

  let isJobCompleted = false, count = 0;

  if (eventList.length > 0) {
    map (eventList, element => {
      if (element.event_status == 'Closed') {
        count++;
      }
    });

    if (count === eventList.length) isJobCompleted = true;
  }

  if (isJobCompleted) {
    return 'Closed';
  } else {
    switch (eventsCount) {
      case 0:
        return 'Open';
      default:
        return 'In-Progress';
    }
  }
};

export const getEventTotalSLa = (events, eventId) => {
  let totalEventTime = 0;

  totalEventTime = reduce (
    events,
    (totalEventTime, value, key) => {
      const {event_sla, _id} = value;
      if (eventId !== _id) {
        totalEventTime = +event_sla;
      }
      return totalEventTime;
    },
    totalEventTime
  );

  return totalEventTime;
};

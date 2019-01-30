import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {get, map} from 'lodash';
import {newEvent, updateJob, updateField} from '../actions/jobs.action';
import {updateStatus} from '../utils';
import moment from 'moment';
import viewIcon from '../assets/img/view-icon.png';
import addIcon from '../assets/img/Group 12.png';
import ControlledPanelGroup from './collapsiblePanel';

class JobsTable extends Component {
  constructor (props) {
    super (props);
  }

  

  render () {
    let {jobTable} = this.props;
    return (
      <div className="jobs ">
          <ControlledPanelGroup jobTable={jobTable} />
      </div>
    );
  }
}

export default connect (
  state => {
    return {
      jobTable: get (state, 'jobdetail.jobs'),
    };
  },
  {newEvent, updateJob}
) (JobsTable);

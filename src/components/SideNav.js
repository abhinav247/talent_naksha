import React, { Component } from 'react';
import {addjob} from '../actions/jobs.action'
import {get} from 'lodash';
import { connect } from "react-redux";

class SideNav extends Component {
  constructor(props){
    super(props)
    this.addNewJob=this.addNewJob.bind(this);
  }

  addNewJob(){
    const {addjob}=this.props;
    addjob();
  }

  render() {
    return (
      <div style={{ alignItems: 'center',fontSize:20 }}>
        <ul
          className='nav flex-column'
          style={{
            backgroundColor: '#F8F8F8',
            padding: '5ex',
            marginTop: '2ex',
            marginLeft: '2ex'
          }}
        >
          <li className='nav-item'>
            <a className='nav-link active' href='#'>
              <i className='fas fa-home' /> Home
            </a>
          </li>
          <li className='nav-item' style={{backgroundColor:'#005181'}}>
            <a className='nav-link' href='#'>
              <i className='fas fa-briefcase' style={{color:'#ffffff'}} /> 
              <span style={{marginLeft:10,color:'#ffffff'}}>Jobs</span>
            </a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' href='#'>
              <i className='fas fa-envelope' /> Messages
            </a>
          </li>
          <li>
            <form className='form-inline'>
              <input
                className='form-control'
                type='search'
                placeholder='Search Jobs'
                aria-label='Search'
              />
            </form>
            <br />
          </li>
          <li>
            <button type='button' className='btn btn-primary btn-lg btn-block' onClick={this.addNewJob}>
              <i className='fas fa-plus' /> Add Job
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

  export default connect(
    state => {
      return {
        jobTable: get(state, "jobdetail.jobs")
      };
    },
  
    {addjob}
  )(SideNav);
  

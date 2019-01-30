import React, { Component } from 'react';
import {connect} from 'react-redux';
import JobsTable from './components/JobsTable'
import HeaderNav from './components/HeaderNav';
import SideNav from './components/SideNav';
import {getAllJobs} from './actions/jobs.action'
import './assets/style/main.scss';
import Loader from "react-loader";


class App extends Component {

  constructor(props){
    super(props);
  }


  componentWillMount(){
    const {getAllJobs}=this.props;
    getAllJobs();
  }

  render() {
    const {loading}=this.props
    return (
     
        <div>
          <HeaderNav />
          <div className='row'>
            <div className='col-md-3'>
              <SideNav />
            </div>
            <div className='col-md-9' style={{ paddingTop: '2ex' }}>
              <JobsTable />
            </div>
          </div>
           <Loader loaded={!loading}/> 
        </div>
    );
  }
}

export default connect(state=>{
  return{
    loading:state.ajaxStatus>0
  }
},{getAllJobs})(App);

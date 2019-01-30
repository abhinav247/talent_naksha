import React, { Component } from 'react';

import  userIcon from '../assets/img/Ellipse.png'

import  dropIcon from '../assets/img/Polygon.png'
class HeaderNav extends Component {
  render() {
    return (
      <div className="header-nav">
       
        
      <div className="row">
          <div className="col-md-3">
              <div className="company-details">
                  <img className="logo"  ></img>
                  <div className="companyName">Company</div>
                  <img className="dropdown" src={dropIcon}></img>
              </div>
          </div>
          <div className="jobs col-md-6">
             <span>Jobs</span>
          </div>
          <div className="col-md-3">
             <div className="user-details">
                  <img className="user-Icon" src={userIcon}></img>
                  <div className="user-name">Pankaj Kumar</div>
                  <img className="dropdown" src={dropIcon}></img>
              </div>

          </div>
      </div>
      
      </div>
    );
  }
}

export default HeaderNav;

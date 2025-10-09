import React from 'react';
import Sidebar from '../../../components/AppliedJobs/Sidebar';
import JobList from '../../../components/AppliedJobs/JobList';
import './style.scss';

const AppliedJobs = () => {
  return (
    <div className="applied-jobs-dashboard">
      <Sidebar />
      <div className="applied-jobs-content">
        <h2>Applied Jobs <span className="count">(8)</span></h2>
        <JobList />
      </div>
    </div>
  );
};

export default AppliedJobs;

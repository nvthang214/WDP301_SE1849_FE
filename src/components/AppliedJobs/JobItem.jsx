import React from 'react';
import './JobItem.scss';

const JobItem = ({ job }) => (
  <div className="job-item">
    <div className="job-info">
      <img src={job.logo} alt={job.company} className="job-logo" />
      <div className="job-details">
        <div className="job-title">{job.title} <span className="job-type">{job.type}</span></div>
        <div className="job-meta">
          <span>{job.location}</span>
          <span>{job.salary}</span>
        </div>
      </div>
    </div>
    <div className="job-date">{job.date}</div>
    <div className="job-status active">✔ {job.status}</div>
    <div className="job-action">
      <button className="view-details">View Details</button>
    </div>
  </div>
);

export default JobItem;

import React from 'react';
import JobItem from './JobItem';
import Pagination from './Pagination';
import './JobList.scss';

const jobs = [
  {
    id: 1,
    logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png',
    title: 'Networking Engineer',
    type: 'Remote',
    location: 'Washington',
    salary: '$50k-80k/month',
    date: 'Feb 2, 2019 19:28',
    status: 'Active',
    company: 'Upwork',
  },
  {
    id: 2,
    logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png',
    title: 'Product Designer',
    type: 'Full Time',
    location: 'Dhaka',
    salary: '$50k-80k/month',
    date: 'Dec 7, 2019 23:26',
    status: 'Active',
    company: 'Dribbble',
  },
  // ...add more jobs as needed
];

const JobList = () => (
  <div className="job-list-section">
    <div className="job-list-header">
      <span>JOBS</span>
      <span>DATE APPLIED</span>
      <span>STATUS</span>
      <span>ACTION</span>
    </div>
    <div className="job-list">
      {jobs.map(job => <JobItem key={job.id} job={job} />)}
    </div>
    <Pagination />
  </div>
);

export default JobList;

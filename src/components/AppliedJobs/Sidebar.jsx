import React from 'react';
import './Sidebar.scss';

const Sidebar = () => (
  <aside className="applied-sidebar">
    <ul>
      <li className="active">Overview</li>
      <li className="active">Applied Jobs</li>
      <li>Favorite Jobs</li>
      <li>Job Alert <span className="badge">09</span></li>
      <li>Settings</li>
    </ul>
    <div className="logout">Log-out</div>
  </aside>
);

export default Sidebar;

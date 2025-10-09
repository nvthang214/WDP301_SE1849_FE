import React from 'react';
import './Pagination.scss';

const Pagination = () => (
  <div className="pagination">
    <button className="prev">&#8592;</button>
    <button className="page active">01</button>
    <button className="page">02</button>
    <button className="page">03</button>
    <button className="page">04</button>
    <button className="page">05</button>
    <button className="next">&#8594;</button>
  </div>
);

export default Pagination;

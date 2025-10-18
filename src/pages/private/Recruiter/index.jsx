import React from "react";

const RecruiterOverview = () => {
  return (
    <div>
      {Array.from({ length: 40 }).map((_, index) => (
        <p key={index}>Recruiter Overview Page - Line {index + 1}</p>
      ))}
    </div>
  );
};

export default RecruiterOverview;

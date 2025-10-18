import React from "react";

const CandidateOverview = () => {
  return (
    <div>
      {Array.from({ length: 40 }).map((_, index) => (
        <p key={index}>Candidate Overview Page - Line {index + 1}</p>
      ))}
    </div>
  );
};

export default CandidateOverview;

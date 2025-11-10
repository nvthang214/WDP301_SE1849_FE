import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";

const TypewriterMarkdown = ({ content = "", speed = 15 }) => {
  return (
    <div className="max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default TypewriterMarkdown;

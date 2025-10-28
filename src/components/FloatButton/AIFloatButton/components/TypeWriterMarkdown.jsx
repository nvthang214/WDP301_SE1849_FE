import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";

const TypewriterMarkdown = ({ content = "", speed = 15 }) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!content) return;

    let i = 0;
    setDisplayed("");
    const clean = DOMPurify.sanitize(content);
    const interval = setInterval(() => {
      setDisplayed(clean.slice(0, i));
      i++;
      if (i > clean.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed]);

  return (
    <div className="max-w-none">
      <ReactMarkdown>{displayed}</ReactMarkdown>
    </div>
  );
};

export default TypewriterMarkdown;

import React from "react";
import "./style.scss";
import { Spin } from "antd";
const LazyLoadingComponent = ({ children }) => {
  return (
    <React.Suspense
      fallback={
        <div className="lazy__loading--component" style={{ height: "100vh" }}>
          <Spin />
        </div>
      }
    >
      {children}
    </React.Suspense>
  );
};

export default LazyLoadingComponent;

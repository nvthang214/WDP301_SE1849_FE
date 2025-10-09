import React from "react";
import { Spin } from "antd";
const LazyLoadingComponent = ({ children }) => {
  return (
    <React.Suspense
      fallback={
        <div
          className="flex justify-center items-center"
          style={{ height: "100vh" }}
        >
          <Spin />
        </div>
      }
    >
      {children}
    </React.Suspense>
  );
};

export default LazyLoadingComponent;

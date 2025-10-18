import React from "react";
import { Spin } from "antd";
const LazyLoad = ({ children }) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex justify-center items-center h-full min-h-[200px]">
          <Spin />
        </div>
      }
    >
      {children}
    </React.Suspense>
  );
};

export default LazyLoad;

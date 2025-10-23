import React from "react";
import { Toaster } from "sonner";

const NotificationContainer = () => {
  return (
    <Toaster
      position="top-right"
      expand
      toastOptions={{
        duration: 3000,
      }}
    />
  );
};

export default NotificationContainer;

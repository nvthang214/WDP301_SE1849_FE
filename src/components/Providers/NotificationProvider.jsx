import React from "react";
import { notification } from "antd";
import { setNotificationApi } from "../Notification/NotificationManager";
import { NotificationContext } from "./Context";

const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  React.useEffect(() => {
    setNotificationApi(api);
  }, [api]);

  return (
    <NotificationContext.Provider value={api}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

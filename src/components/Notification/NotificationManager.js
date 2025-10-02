let notificationApi = null;

export const setNotificationApi = (api) => {
  notificationApi = api;
};

export const notifySuccess = (config) => {
  if (notificationApi) {
    notificationApi.success(config);
  } else {
    console.warn("Notification API chưa được khởi tạo");
  }
};

export const notifyError = (config) => {
  if (notificationApi) {
    notificationApi.error(config);
  } else {
    console.warn("Notification API chưa được khởi tạo");
  }
};

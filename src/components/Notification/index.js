import toast from "react-hot-toast";

export const notifySuccess = (message) => {
  toast.success(message);
};

export const notifyError = (message) => {
  toast.error(message);
};

export const notifyPromise = (promise, { loading, success, error }) => {
  toast.promise(promise, {
    loading,
    success,
    error,
  });
};

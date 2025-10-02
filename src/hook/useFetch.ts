// hooks/useFetch.js
import { useEffect, useState } from "react";
import {
  notifyError,
  notifySuccess,
} from "../components/Notification/NotificationManager";

const useFetch = (fetchFn, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);

    const res = await fetchFn(...args);
    setData(res);

    // Nếu có message -> show notification
    if (res?.message) {
      switch (res.type) {
        case "success":
          notifySuccess({
            message: res.message,
          });
          break;
        case "error":
          notifyError({
            message: res.message,
          });

          break;
        default:
          break;
      }
    }
    return res;
  };

  useEffect(() => {
    if (immediate) execute();
  }, []);

  return { data, loading, error, refetch: execute };
};

export default useFetch;

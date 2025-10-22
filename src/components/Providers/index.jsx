import React from "react";
import useAuthStore from "../../store/useAuthStore";
import { Spin } from "antd";

const Providers = ({ children }) => {
  const { loading, accessToken, user, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = React.useState(true);

  React.useEffect(() => {
    const initial = async () => {
      if (!accessToken) {
        await refresh();
      }
      if (accessToken && !user) {
        await fetchMe();
      }
      setStarting(false);
    };
    initial();
  }, []);

  if (starting || loading) {
    return <></>;
  }
  return children;
};

export default Providers;

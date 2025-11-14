import React from "react";
import useAuthStore from "../../store/useAuthStore";
import { Spin } from "antd";
import RealtimeProvider from "./RealtimeProvider.jsx";

const Providers = ({ children }) => {
  const { loading, init } = useAuthStore();
  const [starting, setStarting] = React.useState(true);

  React.useEffect(() => {
    const initial = async () => {
      await init();
      setStarting(false);
    };
    initial();
  }, [init]);

  if (starting || loading) {
    return <Spin fullscreen spinning />;
  }
  return <RealtimeProvider>{children}</RealtimeProvider>;
};

export default Providers;

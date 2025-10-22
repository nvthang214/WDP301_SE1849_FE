import React from "react";
import useAuthStore from "../../store/useAuthStore";
import { Spin } from "antd";

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
    return <></>;
  }
  return children;
};

export default Providers;

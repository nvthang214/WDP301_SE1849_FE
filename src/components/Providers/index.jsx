import React from "react";
import { StoreContext } from "../../contexts/Context";

const Providers = ({ children }) => {
  const [isLogin, setIsLogin] = React.useState(false);
  const store = {
    loginStore: { isLogin, setIsLogin },
  };

  return <StoreContext.Provider value={{ store }}>{children}</StoreContext.Provider>;
};

export default Providers;

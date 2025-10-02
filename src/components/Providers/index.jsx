import React from "react";
import { StoreContext } from "./Context";
import NotificationProvider from "./NotificationProvider";

const Providers = ({ children }) => {
  const [isLogin, setIsLogin] = React.useState(false);
  const store = {
    loginStore: { isLogin, setIsLogin },
  };

  return (
    <StoreContext.Provider value={{ store }}>
      <NotificationProvider>{children}</NotificationProvider>
    </StoreContext.Provider>
  );
};

export default Providers;

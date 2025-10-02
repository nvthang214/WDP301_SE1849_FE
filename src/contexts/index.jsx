import { useState } from "react";
import { StoreContext } from "./Context";

const StoreProvider = ({ children }) => {
  const [isLogin, setIslogin] = useState(false);
  const store = {
    loginStore: { isLogin, setIslogin },
  };
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export default StoreProvider;

import { useContext } from "react";
import { StoreContext } from "../Providers/Context";
import DefaultHomePage from "../../pages/public/Home";
import ROUTER from "../../router/ROUTER";
import { useRoutes } from "react-router-dom";
import LazyLoadingComponent from "../LazyLoading";
import NotFound from "../../pages/public/NotFound";
const routes = [
  {
    path: ROUTER.HOME,
    element: (
      <LazyLoadingComponent>
        <DefaultHomePage />
      </LazyLoadingComponent>
    ),
  },
  {
    path: "*",
    element: (
      <LazyLoadingComponent>
        <NotFound />
      </LazyLoadingComponent>
    ),
  },
];
const AuthHandle = ({ children }) => {
  const { store } = useContext(StoreContext);
  const { loginStore } = store;
  const { isLogin } = loginStore;
  const renderRouter = useRoutes(routes);
  if (!isLogin) {
    return renderRouter;
  }
  return children;
};

export default AuthHandle;

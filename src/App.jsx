import { Spin } from "antd";
import { RouterProvider } from "react-router-dom";
import ErrorBoundary from "./components/Error";
import FloatButtonContainer from "./components/FloatButton";
import NotificationContainer from "./components/Notification/Container";
import Providers from "./components/Providers";
import router from "./router";
import useAuthStore from "./store/useAuthStore";

function App() {
  const { loading } = useAuthStore();

  return (
    <ErrorBoundary>
      <Providers>
        <Spin spinning={loading} fullscreen />
        <RouterProvider router={router} />
        <FloatButtonContainer />
      </Providers>
      <NotificationContainer />
    </ErrorBoundary>
  );
}

export default App;

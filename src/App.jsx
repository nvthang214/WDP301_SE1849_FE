import { Spin } from "antd";
import { RouterProvider } from "react-router-dom";
import ErrorBoundary from "./components/Error";
import NotificationContainer from "./components/Notification/Container";
import Providers from "./components/Providers";
import router from "./router";

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <Spin spinning={false} fullscreen />
        <RouterProvider router={router} />
        <NotificationContainer />
      </Providers>
    </ErrorBoundary>
  );
}

export default App;

import { Spin } from "antd";
import { BrowserRouter } from "react-router-dom";
import AuthHandle from "./components/Authentication";
import ErrorBoundary from "./components/Error";
import Providers from "./components/Providers";
import AppRouter from "./router/AppRouter";
import NotificationContainer from "./components/Notification/Container";

function App() {
  return (
    <BrowserRouter>
      <Providers>
        <ErrorBoundary>
          <Spin spinning={false} fullscreen />
          <AuthHandle>
            <AppRouter />
          </AuthHandle>
          <NotificationContainer />
        </ErrorBoundary>
      </Providers>
    </BrowserRouter>
  );
}

export default App;

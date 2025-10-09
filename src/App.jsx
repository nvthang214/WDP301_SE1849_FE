import { Spin } from "antd";
import { BrowserRouter } from "react-router-dom";
import AuthHandle from "./components/Authentication";
import ErrorBoundary from "./components/Error";
import Providers from "./components/Providers";
import AppRouter from "./router/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <Providers>
        <ErrorBoundary>
          <Spin spinning={false} fullscreen />
          <AuthHandle>
            <AppRouter />
          </AuthHandle>
        </ErrorBoundary>
      </Providers>
    </BrowserRouter>
  );
}

export default App;
// function App() {
//   return <HeaderMain />;
// }

// export default App;

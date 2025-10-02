import { Spin } from "antd";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/Error";
import Providers from "./components/Providers";
import AppRouter from "./router/AppRouter";
import LayoutCommon from "./components/Layout";
import AuthHandle from "./components/Authentication";

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

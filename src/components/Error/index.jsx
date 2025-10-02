import { Button, Result } from "antd";
import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      // Return the fallback UI
      return (
        <Result
          status="500"
          title="Có lỗi xảy ra!"
          subTitle="Hệ thống xảy ra lỗi, vui lòng tải lại trang để tiếp tục sử dụng!"
          extra={
            <div className="d-flex justify-content-center">
              <Button type="primary" onClick={() => window.location.reload()}>
                Tải lại trang
              </Button>
            </div>
          }
        />
      );
    }
    return this.props.children;
  }
}

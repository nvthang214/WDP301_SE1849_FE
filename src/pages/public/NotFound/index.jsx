import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navidate = useNavigate();
  const handleBackHome = () => {
    navidate("/");
  };
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại."
      extra={
        <Button onClick={handleBackHome} type="primary">
          Về trang chủ
        </Button>
      }
    />
  );
};
export default NotFound;

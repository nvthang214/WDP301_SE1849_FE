import { Result } from "antd";
const NotSupportScreenError = () => (
  <Result
    status="warning"
    title="Không hỗ trợ màn hình"
    subTitle="Vui lòng sử dụng màn hinh lớn hơn để có trải nghiệm tốt nhất. Xin lỗi vì sự bất tiện này."
    extra={<></>}
  />
);
export default NotSupportScreenError;

import { CaretRightOutlined, PhoneFilled } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import NotSupportScreenError from "../../../components/Error/NotSupportScreenError";
import { useWindowSize } from "../../../hook/useWindowSize";
import LoginForm from "./components/LoginForm";
import "./style.scss";
const DefaultHomePage = () => {
  const { width } = useWindowSize();
  if (width < 1440) {
    return <NotSupportScreenError />;
  }
  return (
    <div className="anonymous__home">
      <Row className="anonymous__home--row">
        <Col span={14} className="anonymous__home--row__left">
          <div className="anonymous__home--row__left--content">
            <div className="anonymous__home--row__left--content__system">
              HỆ THỐNG
            </div>
            <div className="anonymous__home--row__left--content__subtitle">
              QUẢN LÝ ỨNG DỤNG
              <span>LOVER</span>
            </div>
            <div className="anonymous__home--row__left--content__description">
              Hệ thống hỗ trợ kiểm soát và quản lý các bài đăng, người dùng,
              hình ảnh, video. Giải pháp quản lý đảm bảo tốc độ và hiệu quả.
            </div>
            <div className="anonymous__home--row__left--content__support">
              <Button type="primary" icon={<PhoneFilled />}>
                Liên hệ hỗ trợ
              </Button>
              <Button
                icon={<CaretRightOutlined />}
                type="primary"
                className="learn__more--btn"
              >
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </Col>
        <Col span={10} className="anonymous__home--row__right">
          <div className="anonymous__home--row__right--title">Đăng nhập</div>
          <LoginForm />
        </Col>
      </Row>
    </div>
  );
};

export default DefaultHomePage;

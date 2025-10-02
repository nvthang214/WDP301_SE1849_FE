import {
  LaptopOutlined,
  NotificationOutlined,
  PieChartOutlined,
  SnippetsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import ROUTER from "../../router/ROUTER";
const { Sider } = Layout;

const MenuLeft = ({ headerHeight }) => {
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const items2 = [
    {
      key: ROUTER.HOME,
      icon: <PieChartOutlined />,
      label: "Tổng quan",
      onClick: (e) => {
        navigate(e.key);
      },
    },
    {
      key: "sub1",
      icon: <UserOutlined />,
      label: "Người dùng",

      children: [
        {
          key: ROUTER.USER_LIST,
          label: "Danh sách người dùng",
          onClick: (e) => {
            navigate(e.key);
          },
        },
        {
          key: ROUTER.USER_LOCKED,
          label: "Tài khoản bị khóa - vi phạm",
          onClick: (e) => {
            navigate(e.key);
          },
        },
        {
          key: ROUTER.USER_VERIFICATION,
          onClick: (e) => {
            navigate(e.key);
          },
          label: "Xác minh tài khoản",
        },
        {
          key: ROUTER.USER_HIGHLIGHTED,
          label: "Người dùng nổi bật",
          onClick: (e) => {
            navigate(e.key);
          },
        },
      ],
    },
    {
      key: "sub2",
      label: "Kiểm duyệt nội dung",
      icon: <SnippetsOutlined />,
      children: [
        {
          key: ROUTER.CONTENT_REPORTS,
          label: "Danh sách báo cáo vi phạm",
          onClick: (e) => {
            navigate(e.key);
          },
        },
        {
          key: ROUTER.CONTENT_BANNED_KEYWORDS,
          onClick: (e) => {
            navigate(e.key);
          },
          label: "Từ khóa cấm ",
        },
      ],
    },
    {
      key: "sub3",
      icon: <NotificationOutlined />,
      label: "Tin nhắn & tương tác",
      children: [
        {
          key: ROUTER.CHAT_HISTORY,
          onClick: (e) => {
            navigate(e.key);
          },
          label: "Lịch sử chat giữa người dùng",
        },
      ],
    },
    {
      key: "sub4",
      icon: <LaptopOutlined />,
      label: "Gói dịch vụ & thanh toán",
      children: [
        {
          key: ROUTER.SERVICE_PACKAGE_LIST,
          onClick: (e) => {
            navigate(e.key);
          },
          label: "Danh sách gói dịch vụ",
        },
        {
          key: ROUTER.SERVICE_INVOICES,
          onClick: (e) => {
            navigate(e.key);
          },
          label: "Giao dịch & hóa đơn",
        },
        {
          key: ROUTER.PROMOTION_CODES,
          onClick: (e) => {
            navigate(e.key);
          },
          label: "Mã khuyến mãi",
        },
        {
          key: ROUTER.PAYMENT_SETTINGS,
          onClick: (e) => {
            navigate(e.key);
          },
          label: "Cài đặt thanh toán",
        },
      ],
    },
    {
      key: "sub5",
      label: "Cấu hình hệ thống",
      icon: <LaptopOutlined />,
      children: [
        {
          key: ROUTER.THEME_LOGO_SETTINGS,
          onClick: (e) => {
            navigate(e.key);
          },
          label: "Cấu hình theme & logo",
        },
      ],
    },
    {
      key: "sub6",
      label: "Quản lý hỗ trợ",
      icon: <SnippetsOutlined />,
      children: [
        {
          key: ROUTER.SUPPORT_REQUESTS,
          onClick: (e) => {
            navigate(e.key);
          },
          label: "Danh sách yêu cầu hỗ trợ",
        },
      ],
    },
    {
      key: "sub7",
      label: "Quản trị viên hệ thống",
      icon: <UserOutlined />,
      children: [
        {
          key: ROUTER.STAFF_LIST,
          onClick: (e) => {
            navigate(e.key);
          },
          label: "Danh sách nhân viên",
        },
        {
          key: ROUTER.ACCESS_CONTROL,
          label: "Phân quyền truy cập",
        },
        {
          key: ROUTER.OPERATION_LOG,
          onClick: (e) => {
            navigate(e.key);
          },
          label: "Nhật ký thao tác của admin",
        },
      ],
    },
  ];
  return (
    <Sider
      width={250}
      style={{
        height: `calc(100vh - ${headerHeight + "px"})`,
        overflowY: "scroll",
        overflowX: "hidden",
        background: "var(--white)",
      }}
      className="layout__common--sider"
      collapsible
      theme="light"
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={[path]}
        defaultOpenKeys={[
          "sub0",
          "sub1",
          "sub2",
          "sub3",
          "sub4",
          "sub5",
          "sub6",
          "sub7",
        ]}
        style={{
          height: "100%",
          borderRight: 0,
          background: "var(--white)",
        }}
        items={items2}
      />
    </Sider>
  );
};

export default MenuLeft;

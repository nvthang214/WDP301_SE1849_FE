import { Button, Form, Input } from "antd";
import { useContext } from "react";
import { StoreContext } from "../../../../components/Providers/Context";

const LoginForm = () => {
  const { store } = useContext(StoreContext);
  const { loginStore } = store;
  const { setIsLogin } = loginStore;

  const onFinish = () => {
    // Simulate a successful login
    setIsLogin(true);
    console.log("Login successful");
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
    >
      <Form.Item
        label="Tên đăng nhập"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};
export default LoginForm;

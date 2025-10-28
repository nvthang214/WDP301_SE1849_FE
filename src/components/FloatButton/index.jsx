import { FloatButton } from "antd";
import AIFloatButton from "./AIFloatButton";
import useAuthStore from "../../store/useAuthStore";

const FloatButtonContainer = () => {
  const { user } = useAuthStore();
  return (
    <>
      <FloatButton.BackTop
        style={{
          bottom: 12,
        }}
      />
      {user && user.role?.name === "candidate" && <AIFloatButton />}
    </>
  );
};

export default FloatButtonContainer;

import useFetch from "../../../hook/useFetch";
import { UserService } from "../../../services/UserService";

const HomeMain = () => {
  const { data, loading } = useFetch(() => UserService.getUser());
  console.log("====================================");
  console.log("HomeMain data", data);
  console.log("====================================");
  return <div>HomeMain s </div>;
};

export default HomeMain;

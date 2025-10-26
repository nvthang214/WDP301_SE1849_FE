import { EnvironmentOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Card } from "antd";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ROUTER from "../../../router/ROUTER";

const CompanyCard = ({ name = "", location = "", openings = 0, logo = "" }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(ROUTER.COMPANY_LIST);
  };

  return (
    <Card
      className="rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer bg-white h-full"
      bodyStyle={{ padding: "24px", height: "100%", display: "flex", flexDirection: "column" }}
      onClick={handleCardClick}
    >
      {/* Header with logo */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-lg">
          {logo ? (
            <img src={logo} alt={name} className="w-12 h-12 object-cover rounded-full" />
          ) : (
            name?.charAt(0)?.toUpperCase() || 'D'
          )}
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          Featured
        </span>
      </div>

      {/* Company info - flex-grow để đẩy button xuống dưới */}
      <div className="flex-grow mb-4 flex flex-col">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 min-h-[3.5rem]">{name || 'Dribbble'}</h3>
        <div className="flex items-center text-gray-500 text-sm mt-auto">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{location || 'Dhaka, Bangladesh'}</span>
        </div>
      </div>
    
      {/* View Details Button - luôn ở cuối card */}
      <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 mt-auto">
        View Company
      </button>
    </Card>
  );
};

export default CompanyCard;

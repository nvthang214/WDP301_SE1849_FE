import { BookOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Card, Tag, Tooltip } from "antd";
import { BriefcaseBusiness, MapPin } from "lucide-react";

const CompanyCard = ({ name, location, openings, logo }) => {
  return (
    <Card
      className="rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
      bodyStyle={{ padding: "16px" }}
    >
      <div className="flex items-center gap-3">
        <img src={logo} alt={name} className="w-16 h-16 object-contain rounded" />
        <div className="space-y-3">
          <div className="font-semibold text-gray-800">{name}</div>
          <div className="text-gray-500 text-sm flex items-center gap-1">
            <EnvironmentOutlined /> {location}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Tag color="blue" className="">
          <BriefcaseBusiness className="w-4 h-4 inline mr-1" />
          {openings} Openings
        </Tag>
      </div>
    </Card>
  );
};

export default CompanyCard;

import React from "react";
import { Link } from "react-router-dom";
import { Card, Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const CompanyCard = ({ companyId, name, companyType, openings, logo, location }) => {
  return (
    <Link to="/companies">
      <Card
        className="rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
        bodyStyle={{ padding: "16px" }}
        hoverable
      >
        {/* Company name + type */}
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{name || 'Company Name'}</h3>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Tag color="blue" className="m-0 rounded px-2 py-0.5 text-xs font-medium">
              {companyType}
            </Tag>
            <span className="text-gray-500">
              <span className="font-medium text-gray-700">Openings:</span> {openings}
            </span>
          </div>
        </div>

        {/* Company logo + location */}
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center gap-3">
            {logo ? (
              <img src={logo} alt={name} className="h-15 w-15 rounded object-cover" />
            ) : (
              <div className="w-15 h-15 rounded bg-blue-500 flex items-center justify-center text-white font-bold">
                {name?.charAt(0)?.toUpperCase() || 'C'}
              </div>
            )}
            <div>
              <p className="font-medium text-gray-800">{name}</p>
              <p className="flex items-center gap-1 text-sm text-gray-500">
                <EnvironmentOutlined /> {location || 'Location not specified'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CompanyCard;

import React from "react";
import { Link } from "react-router-dom";
import { Card, Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

export default function CompanyCard({ companyId, name, location, openings, logo, companyType, linkTo }) {
  const href = linkTo ?? `/companies/${companyId}`;
  return (
    <Link to={href} className="block">
      <Card
        className="rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
        bodyStyle={{ padding: "20px" }}
        hoverable
      >
        {/* Company name + type */}
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-gray-900">{name || "Company Name"}</h3>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Tag color="blue" className="m-0 rounded px-3 py-1 text-xs font-medium">
              {companyType || "Technology"}
            </Tag>
            <span className="text-gray-500">
              <span className="font-medium text-gray-700">Openings:</span> {openings ?? 0}
            </span>
          </div>
        </div>

        {/* Company logo + location */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-3">
            {logo ? (
              <img src={logo} alt={name} className="h-16 w-16 md:h-20 md:w-20 rounded object-cover" />
            ) : (
              <div className="h-16 w-16 md:h-20 md:w-20 rounded bg-gray-100 flex items-center justify-center text-gray-500 text-xs">
                No Logo
              </div>
            )}
            <div>
              <p className="font-medium text-gray-800">{name}</p>
              <p className="flex items-center gap-1 text-sm text-gray-500">
                <EnvironmentOutlined /> {location || "Location not specified"}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

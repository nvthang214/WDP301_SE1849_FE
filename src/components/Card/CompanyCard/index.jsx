import React from "react";
import { Link } from "react-router-dom";
import { Card, Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

export default function CompanyCard({
  companyId,
  name,
  location,
  openings,
  logo,
  companyType,
  linkTo,
}) {
  const href = linkTo ?? `/companies/${companyId}`;
  return (
    <Link to={href} className="block h-full">
      <Card
        className="h-full rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
        bodyStyle={{ padding: "20px" }}
        hoverable
      >
        <div className="flex flex-col h-full justify-between">
          {/* Company name + type */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold text-gray-900 truncate">{name || "Company Name"}</h3>
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

          {/* Company logo + location (footer) */}
          <div className="mt-4">
            <div className="flex items-center gap-3">
              {logo ? (
                <img
                  src={logo}
                  alt={name}
                  className="h-16 w-16 flex-shrink-0 rounded object-cover md:h-20 md:w-20"
                />
              ) : (
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-xs text-gray-500 md:h-20 md:w-20">
                  No Logo
                </div>
              )}
              <div className="min-w-0">
                <p className="flex items-center gap-1 text-sm text-gray-500 truncate">
                  <EnvironmentOutlined /> {location || "Location not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

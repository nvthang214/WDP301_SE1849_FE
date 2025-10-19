import React from "react";
import { Typography } from "antd";
import {
	UserOutlined,
	IdcardOutlined,
	GlobalOutlined,
	SettingOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const NAV_ITEMS = [
	{ key: "personal", label: "Personal", icon: <UserOutlined /> },
	{ key: "profile", label: "Profile", icon: <IdcardOutlined /> },
	{ key: "social", label: "Social Links", icon: <GlobalOutlined /> },
	{ key: "account", label: "Account Setting", icon: <SettingOutlined /> },
];

const Header = ({ activeKey = "social", className = "" }) => {
	return (
		<section>
			<div className="flex flex-col gap-6 p-6">
				<Title level={3} className="!mb-0 text-neutral-900">
					Settings
				</Title>
				<nav className="border-b border-neutral-200">
					<div className="flex flex-wrap items-center gap-6">
						{NAV_ITEMS.map((item) => {
							const isActive = item.key === activeKey;
							return (
								<div
									key={item.key}
									className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors ${
										isActive
											? "border-primary-500 text-primary-600"
											: "border-transparent text-neutral-500 hover:text-neutral-700"
									}`}
								>
									<span className={`text-base ${isActive ? "text-primary-500" : "text-neutral-400"}`}>
										{item.icon}
									</span>
									<span>{item.label}</span>
								</div>
							);
						})}
					</div>
				</nav>
			</div>
		</section>
	);
};

export default Header;

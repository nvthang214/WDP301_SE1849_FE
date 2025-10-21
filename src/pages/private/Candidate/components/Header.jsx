import React from "react";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import {
	UserOutlined,
	IdcardOutlined,
	GlobalOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import ROUTER from "../../../../router/ROUTER";

const { Title } = Typography;

const NAV_ITEMS = [
	{
		key: "personal",
		label: "Personal",
		icon: <UserOutlined />,
		route: ROUTER.CANDIDATE_OVERVIEW,
	},
	{
		key: "profile",
		label: "Profile",
		icon: <IdcardOutlined />,
		route: ROUTER.CANDIDATE_PROFILE,
	},
	{
		key: "social",
		label: "Social Links",
		icon: <GlobalOutlined />,
		route: ROUTER.CANDIDATE_SOCIAL,
	},
	{
		key: "account",
		label: "Account Setting",
		icon: <SettingOutlined />,
		route: ROUTER.CANDIDATE_ACCOUNT,
	},
];

const Header = ({ activeKey = "social", className = "" }) => {
	const navigate = useNavigate();

	const handleNavigate = (route) => {
		if (!route) return;
		navigate(route);
	};

	return (
		<section>
			<div className="flex flex-col mb-8">
				<Title level={3} className="!mb-6 text-neutral-900">
					Settings
				</Title>
				<nav className="border-b border-neutral-200">
					<div className="flex flex-wrap items-center gap-6">
						{NAV_ITEMS.map((item) => {
							const isActive = item.key === activeKey;
							return (
								<button
									key={item.key}
									type="button"
									onClick={() => handleNavigate(item.route)}
									className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors disabled:opacity-50 ${
										isActive
											? "border-primary-500 text-primary-600"
											: "border-transparent text-neutral-500 hover:text-neutral-700"
									}`}
									disabled={!item.route}
								>
									<span className={`text-base ${isActive ? "text-primary-500" : "text-neutral-400"}`}>
										{item.icon}
									</span>
									<span>{item.label}</span>
								</button>
							);
						})}
					</div>
				</nav>
			</div>
		</section>
	);
};

export default Header;

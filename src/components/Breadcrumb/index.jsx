// components/BreadcrumbNav.jsx
import { Breadcrumb } from "antd";
import { Link, useMatches } from "react-router-dom";

const BreadcrumbNav = () => {
  const matches = useMatches();

  // Lọc những route có handle.breadcrumb
  const breadcrumbMatches = matches.filter((match) => match.handle && match.handle.breadcrumb);

  // ❗ Nếu chỉ có 1 route (trang chủ) thì không render gì cả
  if (breadcrumbMatches.length <= 1) return null;

  const items = breadcrumbMatches.map((match, index) => {
    const last = index === breadcrumbMatches.length - 1;
    const breadcrumb = match.handle.breadcrumb;

    return {
      title: last ? (
        <span className="font-semibold text-neutral-900">{breadcrumb}</span>
      ) : (
        <Link to={match.pathname || "#"}>{breadcrumb}</Link>
      ),
    };
  });

  return <Breadcrumb items={items} className="!py-4" />;
};

export default BreadcrumbNav;

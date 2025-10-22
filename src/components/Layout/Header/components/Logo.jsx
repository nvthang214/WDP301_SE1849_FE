import React from "react";
import ROUTER from "../../../../router/ROUTER";
import logo from "../../../../assets/images/Logo/logosvg.svg";
import { Link } from "react-router-dom";
const Logo = () => {
  return (
    <div className="flex items-center gap-10">
      <Link to={ROUTER.HOME} className="flex items-center gap-2">
        <img src={logo} alt="Jobpilot" className="h-9 w-auto" />
        <span className="text-2xl font-semibold text-neutral-900">Jobpilot</span>
      </Link>
    </div>
  );
};

export default Logo;

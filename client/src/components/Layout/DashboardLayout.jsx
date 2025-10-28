import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiUser,
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiSettings,
} from "react-icons/fi";

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { icon: FiGrid, label: "Dashboard", path: "/dashboard" },
    { icon: FiUser, label: "Profile", path: "/profile" },
    { icon: FiPackage, label: "Products", path: "/products" },
    { icon: FiShoppingBag, label: "Orders", path: "/orders" },
    { icon: FiSettings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white shadow-lg fixed left-0">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Farmer Dashboard
            </h2>
          </div>
          <nav className="mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-emerald-50 transition-colors ${
                    location.pathname === item.path
                      ? "text-emerald-600 bg-emerald-50 border-r-4 border-emerald-600"
                      : ""
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

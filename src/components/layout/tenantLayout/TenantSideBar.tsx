import { Building2, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTenantNavList } from "./TenantNavList";

function TenantSideBar() {
  const navigate = useNavigate();
  const tenantNavList = useTenantNavList();
  const { t: account } = useTranslation("account");
  const { t: auth } = useTranslation("auth");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {sidebarOpen && (
          <div
            onClick={() => navigate("/")}
            className="flex gap-2 cursor-pointer"
          >
            <span>
              <Building2 color="blue" size={35} />
            </span>
            <h1 className="text-blue-700 font-bold text-3xl">VStay</h1>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {tenantNavList.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.title}
              to={item.url}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{account(item.title)}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer - Logout */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition">
          <LogOut className="h-5 w-5 shrink-0" />
          {sidebarOpen && <span>{auth("logout")}</span>}
        </button>
      </div>
    </div>
  );
}

export default TenantSideBar;

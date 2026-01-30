import { ChevronLeft, ChevronRight, LayoutDashboard, User } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function SideBar() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  return (
    <aside
      className={`h-screen bg-gray-900 text-white transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <span className="text-lg font-bold">Admin</span>}
        <button className="cursor-pointer hover:bg-black p-1 rounded-full transition duration-300" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      <nav className="mt-4 flex flex-col gap-1">
        <NavLink
          to="/admin/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 hover:bg-gray-700
            ${isActive ? "bg-gray-700" : ""}`
          }
        >
          <LayoutDashboard />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 hover:bg-gray-700
            ${isActive ? "bg-gray-700" : ""}`
          }
        >
          <User />
          {!collapsed && <span>User</span>}
        </NavLink>
      </nav>
    </aside>
  );
}

export default SideBar;

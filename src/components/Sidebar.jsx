import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 flex flex-col bg-white dark:bg-background-dark border-r border-[#dedae7] dark:border-white/10">
      <div className="p-6 flex flex-col h-full justify-between">
        <div className="flex flex-col gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined">rocket_launch</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#131018] dark:text-white text-base font-bold leading-tight">
                Hecolt CRM
              </h1>
              <p className="text-[#6d5e8d] dark:text-gray-400 text-xs font-normal">
                Marketing Workflow
              </p>
            </div>
          </div>
          {/* Menu Items */}
          <nav className="flex flex-col gap-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-[#131018] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"}`
              }
            >
              <span className="material-symbols-outlined text-[24px]">
                dashboard
              </span>
              <p className="text-sm font-medium">Dashboard</p>
            </NavLink>
            <NavLink
              to="/clients"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-[#131018] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"}`
              }
            >
              <span className="material-symbols-outlined text-[24px]">
                group
              </span>
              <p className="text-sm font-medium">Clients</p>
            </NavLink>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-[#131018] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"}`
              }
            >
              <span className="material-symbols-outlined text-[24px]">
                assignment
              </span>
              <p className="text-sm font-medium">Tasks</p>
            </NavLink>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#131018] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">
                groups
              </span>
              <p className="text-sm font-medium">Team</p>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#131018] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">
                settings
              </span>
              <p className="text-sm font-medium">Settings</p>
            </a>
          </nav>
        </div>
        {/* Footer Sidebar */}
        <div className="flex flex-col gap-2 pt-4 border-t border-[#dedae7] dark:border-white/10">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-[#131018] dark:text-gray-300"
          >
            <span className="material-symbols-outlined text-[24px]">
              help_center
            </span>
            <p className="text-sm font-medium">Support</p>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

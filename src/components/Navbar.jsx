import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ title = "Dashboard" }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear any stored auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Navigate back to the login page and replace history
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white dark:bg-background-dark border-b border-[#dedae7] dark:border-white/10 px-8 py-4">
      <div className="flex items-center gap-8">
        <h2 className="text-[#131018] dark:text-white text-xl font-bold">
          {title}
        </h2>
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#6d5e8d]">
            <span className="material-symbols-outlined text-[20px]">
              search
            </span>
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2 border-none bg-background-light dark:bg-white/5 dark:text-white rounded-lg text-sm placeholder:text-[#6d5e8d] focus:ring-2 focus:ring-primary"
            placeholder="Search projects or clients"
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg bg-background-light dark:bg-white/5 text-[#131018] dark:text-white hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-[20px]">
            notifications
          </span>
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="h-10 w-10 rounded-full bg-primary/20 border-2 border-primary overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/60"
          >
            <img
              alt="Profile Avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZHxBpYyNdYU2HBxEjRD-T_iFq8O2Wx0uHUJo6Bw2on5AtcRROSEA9qmElH_JNrUwHSSRKW6rKu30MyLB0FayKavgqkK20ViSGoo2oMb9EBHW-pdK3t3dvaRPlQQCs9mFSEAAZqiLcD0iEJZ8xvKKNPVAfPw5STDeQi4WgS95h2TkIC4ZCXhKP2aZqR0vp3ka_5y1Al3IUrzpfL8l2WLvnFJGVaVOhD09G49JsPO95MK_Sb0PnIkdD2UyEdiuumuX1ZE68P8cALC2C"
            />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg bg-white dark:bg-[#1c1430] border border-[#dedae7] dark:border-white/10 shadow-lg py-1 text-sm">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-[#131018] dark:text-white hover:bg-background-light dark:hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

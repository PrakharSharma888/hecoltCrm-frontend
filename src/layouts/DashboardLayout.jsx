import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ title }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={title} />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

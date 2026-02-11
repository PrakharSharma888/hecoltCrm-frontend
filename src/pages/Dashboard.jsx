import React, { useEffect, useState } from "react";
import { api } from "../services/api";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    api.getDashboardStats().then(setStats);
    api.getRecentActivity().then(setActivity);
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark border border-[#dedae7] dark:border-white/10 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[#6d5e8d] dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                Total Clients
              </p>
              <span className="material-symbols-outlined text-primary">
                person
              </span>
            </div>
            <p className="text-[#131018] dark:text-white text-3xl font-bold">
              {stats.clients}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark border border-[#dedae7] dark:border-white/10 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[#6d5e8d] dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                Active Tasks
              </p>
              <span className="material-symbols-outlined text-primary">
                task_alt
              </span>
            </div>
            <p className="text-[#131018] dark:text-white text-3xl font-bold">
              {stats.activeTasks}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark border border-[#dedae7] dark:border-white/10 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[#6d5e8d] dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                Pending Deadlines
              </p>
              <span className="material-symbols-outlined text-[#e74408]">
                warning
              </span>
            </div>
            <p className="text-[#131018] dark:text-white text-3xl font-bold">
              {stats.pendingDeadlines}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <section>
          <h3 className="text-[#131018] dark:text-white text-lg font-bold mb-4">
            Quick Actions
          </h3>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/add-client")}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[20px]">
                person_add
              </span>
              <span>Add New Client</span>
            </button>
            <button
              onClick={() => navigate("/tasks")}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 text-[#131018] dark:text-white border border-[#dedae7] dark:border-white/10 rounded-lg font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                add_task
              </span>
              <span>Create Task</span>
            </button>
          </div>
        </section>

        {/* Recent Activity Feed */}
        <section className="bg-white dark:bg-background-dark border border-[#dedae7] dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#dedae7] dark:border-white/10 flex justify-between items-center">
            <h3 className="text-[#131018] dark:text-white text-lg font-bold">
              Recent Activity
            </h3>
            <button className="text-primary text-sm font-semibold hover:underline">
              View All
            </button>
          </div>
          <div className="divide-y divide-[#dedae7] dark:divide-white/10">
            {activity.map((item) => (
              <div
                key={item.id}
                className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                {item.isSystem ? (
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">
                      person_add
                    </span>
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                    <img
                      alt={item.user}
                      className="w-full h-full object-cover"
                      src={item.avatar}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm text-[#131018] dark:text-white">
                    <span className="font-bold">{item.user}</span>{" "}
                    {item.action && (
                      <>
                        {item.action}{" "}
                        <span className="font-semibold text-primary underline">
                          {item.target}
                        </span>
                      </>
                    )}
                    {item.status === "Done" && (
                      <span className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold uppercase">
                        Done
                      </span>
                    )}
                  </p>
                  {item.content && (
                    <p
                      className={`text-sm text-[#6d5e8d] dark:text-gray-400 mt-1 ${item.action === "updated the deadline for" ? "text-red-500" : "italic border-l-2 border-primary/30 pl-3"}`}
                    >
                      "{item.content}"
                    </p>
                  )}
                  <p className="text-xs text-[#6d5e8d] dark:text-gray-400 mt-2">
                    {item.time} • {item.project || item.assignee}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

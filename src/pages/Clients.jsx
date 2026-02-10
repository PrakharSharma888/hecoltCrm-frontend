import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await api.getClients();
      setClients(data || []);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
      // Set empty array on error instead of crashing
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.companyName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">Loading clients...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Clients
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your agency clients and their details
            </p>
          </div>
          <button
            onClick={() => navigate("/add-client")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Client
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search clients by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
          />
        </div>

        {/* Clients Grid */}
        {filteredClients.length === 0 ? (
          <div className="bg-white dark:bg-background-dark/50 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">
              group
            </span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              No clients found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by adding your first client"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate("/add-client")}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2 text-sm font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">
                  add
                </span>
                Add Your First Client
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div
                key={client._id || client.id}
                className="bg-white dark:bg-[#1c142e] border border-gray-200 dark:border-[#2d2445] rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => {
                  // Navigate to client details if needed
                  console.log("Client clicked:", client);
                }}
              >
                {/* Client Avatar/Icon */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {(client.name || client.companyName || "C")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
                      {client.name || client.companyName || "Unnamed Client"}
                    </h3>
                    {client.industry && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {client.industry}
                      </p>
                    )}
                  </div>
                </div>

                {/* Client Details */}
                <div className="space-y-2">
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="material-symbols-outlined text-[16px]">
                        mail
                      </span>
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="material-symbols-outlined text-[16px]">
                        phone
                      </span>
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.website && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="material-symbols-outlined text-[16px]">
                        language
                      </span>
                      <span className="truncate">{client.website}</span>
                    </div>
                  )}
                </div>

                {/* Services & Budget */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  {client.services && client.services.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {client.services.slice(0, 3).map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded"
                        >
                          {service}
                        </span>
                      ))}
                      {client.services.length > 3 && (
                        <span className="px-2 py-1 text-xs font-medium text-gray-500">
                          +{client.services.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  {client.monthlyBudget && (
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${parseInt(client.monthlyBudget).toLocaleString()}/mo
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;

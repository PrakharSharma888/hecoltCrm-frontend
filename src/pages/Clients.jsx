import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

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
      <div className="h-full overflow-y-auto p-8 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="w-1/3 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="w-32 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          </div>
          <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded-lg mt-2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-[#1c142e] border border-gray-100 dark:border-[#2d2445] rounded-xl p-6 h-56 flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
                <div className="w-full h-8 bg-gray-200 dark:bg-gray-800 rounded mt-auto"></div>
              </div>
            ))}
          </div>
        </div>
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
                onClick={() => setSelectedClient(client)}
              >
                {/* Client Avatar/Icon */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                    {(client.name || client.companyName || "C")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
                      {client.name || client.companyName || "Unnamed Client"}
                    </h3>
                  </div>
                </div>

                {/* Client Details */}
                <div className="space-y-2 min-h-[40px]">
                  {client.usp && (
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                        star
                      </span>
                      <span className="line-clamp-2">{client.usp}</span>
                    </div>
                  )}
                  {client.targetAudience && !client.usp && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="material-symbols-outlined text-[16px] shrink-0">
                        group
                      </span>
                      <span className="truncate">{client.targetAudience}</span>
                    </div>
                  )}
                </div>

                {/* Services & Location */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  {(client.servicesProviding || client.services) && (client.servicesProviding || client.services).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(client.servicesProviding || client.services).slice(0, 3).map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-[10px] sm:text-xs font-medium bg-primary/10 text-primary rounded"
                        >
                          {service}
                        </span>
                      ))}
                      {(client.servicesProviding || client.services).length > 3 && (
                        <span className="px-2 py-1 text-xs font-medium text-gray-500">
                          +{(client.servicesProviding || client.services).length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  {client.targetLocations && (
                    <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="material-symbols-outlined text-[16px] shrink-0">location_on</span>
                      <span className="truncate">{client.targetLocations}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm shadow-2xl">
          <div className="bg-white dark:bg-[#150f22] border border-gray-200 dark:border-[#2d2445] rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedClient(null)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors outline-none focus:ring-2 focus:ring-primary rounded-lg"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shrink-0">
                {(selectedClient.name || selectedClient.companyName || "C")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  {selectedClient.name || selectedClient.companyName || "Client Details"}
                </h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="px-2.5 py-1 text-xs font-bold text-primary bg-primary/10 rounded-full">
                    Active Client
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {selectedClient.businessDescription && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">description</span>
                    Business Description
                  </h4>
                  <div className="bg-gray-50 dark:bg-background-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                      {selectedClient.businessDescription}
                    </p>
                  </div>
                </div>
              )}

              {selectedClient.usp && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">star</span>
                    Unique Selling Proposition (USP)
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {selectedClient.usp}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                {selectedClient.targetLocations && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                      Target Locations
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {selectedClient.targetLocations}
                    </p>
                  </div>
                )}

                {selectedClient.targetAudience && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">group</span>
                      Target Audience
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {selectedClient.targetAudience}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                {((selectedClient.servicesProviding && selectedClient.servicesProviding.length > 0) || (selectedClient.services && selectedClient.services.length > 0)) && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">category</span>
                      Services Providing
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(selectedClient.servicesProviding || selectedClient.services).map((service, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm font-semibold bg-primary/10 text-primary rounded-full border border-primary/20"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedClient.typeOfContent && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">article</span>
                      Type of Content
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                      {selectedClient.typeOfContent}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-bold text-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;

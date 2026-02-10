import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const AddClient = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    industry: "",
    contactName: "",
    email: "",
    phone: "",
    services: [],
    monthlyBudget: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleService = (service) => {
    setFormData((prev) => {
      const services = prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Map form data to API expected format if necessary
      // Using the structure from the form, assuming backend handles it or minimal mapping
      const payload = {
        name: formData.companyName, // Mapping companyName to name based on user example
        email: formData.email,
        ...formData, // Sending other fields just in case
      };

      await api.addClient(payload);
      navigate("/dashboard"); // Redirect to dashboard or clients list
    } catch (error) {
      alert("Failed to add client. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-medium">
          <a
            className="text-gray-500 hover:text-primary transition-colors"
            href="#"
          >
            Clients
          </a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 dark:text-white">Add New Client</span>
        </nav>
        {/* Page Heading */}
        <header className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Add New Client
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Fill in the details below to register a new agency client and start
            a workflow.
          </p>
        </header>
        {/* Form Section */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Company Information Card */}
          <section className="bg-white dark:bg-background-dark/50 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  business
                </span>
                Company Information
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Company Name
                </span>
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                  placeholder="e.g. Acme Corp"
                  type="text"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Website URL
                </span>
                <input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                  placeholder="https://www.acme.com"
                  type="url"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Industry
                </span>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                >
                  <option value="">Select Industry</option>
                  <option value="tech">Technology</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                </select>
              </label>
            </div>
          </section>
          {/* Contact Details Card */}
          <section className="bg-white dark:bg-background-dark/50 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  person
                </span>
                Primary Contact
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Contact Name
                </span>
                <input
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                  placeholder="John Doe"
                  type="text"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address
                </span>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                  placeholder="john@acmecorp.com"
                  type="email"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Phone Number
                </span>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                />
              </label>
            </div>
          </section>
          {/* Service Configuration Card */}
          <section className="bg-white dark:bg-background-dark/50 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  settings_suggest
                </span>
                Service Configuration
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Service Type
                </span>
                <div className="flex flex-wrap gap-2">
                  {/* Helper component for toggle buttons */}
                  {[
                    "SEO",
                    "PPC",
                    "Content Marketing",
                    "Social Media",
                    "Email Marketing",
                  ].map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center gap-2 transition-colors ${
                        formData.services.includes(service)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {service}
                      {formData.services.includes(service) && (
                        <span className="material-symbols-outlined text-xs">
                          close
                        </span>
                      )}
                    </button>
                  ))}
                  <button
                    className="p-2 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:text-primary hover:border-primary transition-all"
                    type="button"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
              <label className="flex flex-col gap-2 max-w-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Monthly Budget
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">
                      info
                    </span>{" "}
                    Target amount
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    $
                  </span>
                  <input
                    name="monthlyBudget"
                    value={formData.monthlyBudget}
                    onChange={handleChange}
                    className="w-full h-12 pl-8 pr-4 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                    placeholder="5,000"
                    type="number"
                  />
                </div>
              </label>
            </div>
          </section>
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pb-12">
            <button
              className="px-6 py-3 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button
              className="px-8 py-3 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2 items-center justify-center disabled:opacity-70"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">
                    save
                  </span>
                  Save Client
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClient;

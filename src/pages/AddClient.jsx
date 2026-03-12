import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const AddClient = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    businessDescription: "",
    usp: "",
    targetLocations: "",
    targetAudience: "",
    servicesProviding: "",
    typeOfContent: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* removed toggleService */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name: formData.companyName || "Unknown Client",
        ...formData,
      };

      await api.addClient(payload);
      navigate("/dashboard");
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
          {/* Client Overview Card */}
          <section className="bg-white dark:bg-background-dark/50 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  business
                </span>
                Client Overview
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 gap-6">
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
                  Business Description (in client’s words)
                </span>
                <textarea
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-4 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 dark:text-white resize-none"
                  placeholder="Describe the business..."
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Unique Selling Proposition (USP)
                </span>
                <input
                  name="usp"
                  value={formData.usp}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                  placeholder="What makes them unique?"
                  type="text"
                />
              </label>
            </div>
          </section>

          {/* Target Market Card */}
          <section className="bg-white dark:bg-background-dark/50 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  public
                </span>
                Target Market
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Target Locations (City / State / Country)
                </span>
                <input
                  name="targetLocations"
                  value={formData.targetLocations}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                  placeholder="e.g. New York, NY / USA"
                  type="text"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Target Audience (Age, Gender, Industry, Budget, etc.)
                </span>
                <textarea
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-4 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 dark:text-white resize-none"
                  placeholder="Describe their target audience..."
                />
              </label>
            </div>
          </section>

          {/* Services & Content Card */}
          <section className="bg-white dark:bg-background-dark/50 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  category
                </span>
                Services & Content
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Services Providing
                </span>
                <input
                  name="servicesProviding"
                  value={formData.servicesProviding}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                  placeholder="e.g. SEO, Content Marketing..."
                  type="text"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Type of content
                </span>
                <input
                  name="typeOfContent"
                  value={formData.typeOfContent}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                  placeholder="e.g. Blog posts, Videos, Graphics..."
                  type="text"
                />
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

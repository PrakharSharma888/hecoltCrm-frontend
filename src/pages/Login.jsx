import React, { useState } from "react";
import Logo from "../components/Logo";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dedae7] dark:border-[#2d2445] px-10 py-3 bg-white dark:bg-[#1c1430]">
        <div className="flex items-center gap-4 text-[#131018] dark:text-white">
          <Logo />
          <h2 className="text-[#131018] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Hecolt CRM
          </h2>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-[#6d5e8d] dark:text-[#a195bc] hidden sm:inline">
            Internal Access Only
          </span>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold">
            Support
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[480px] bg-white dark:bg-[#1c1430] rounded-xl shadow-xl border border-[#dedae7] dark:border-[#2d2445] overflow-hidden">
          <div className="px-8 pt-10 pb-4">
            <h1 className="text-[#131018] dark:text-white text-[28px] font-bold leading-tight text-center">
              Welcome back
            </h1>
            <p className="text-[#6d5e8d] dark:text-[#a195bc] text-base font-normal leading-normal text-center mt-2">
              Enter your credentials to access the agency portal
            </p>
          </div>
          <form className="px-8 pb-10 space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex flex-col w-full">
              <label className="flex flex-col w-full">
                <p className="text-[#131018] dark:text-white text-sm font-medium leading-normal pb-2">
                  Email Address
                </p>
                <input
                  className="form-input flex w-full rounded-lg text-[#131018] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dedae7] dark:border-[#2d2445] bg-white dark:bg-[#150f23] h-12 placeholder:text-[#6d5e8d] dark:placeholder:text-[#6d5e8d] px-4 text-base font-normal"
                  placeholder="name@agency.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            {/* Password Field */}
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center pb-2">
                <p className="text-[#131018] dark:text-white text-sm font-medium leading-normal">
                  Password
                </p>
                <a
                  className="text-primary text-xs font-semibold hover:underline"
                  href="#"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative flex w-full items-stretch">
                <input
                  className="form-input flex w-full rounded-lg text-[#131018] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dedae7] dark:border-[#2d2445] bg-white dark:bg-[#150f23] h-12 placeholder:text-[#6d5e8d] dark:placeholder:text-[#6d5e8d] pl-4 pr-12 text-base font-normal"
                  placeholder="••••••••"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute right-0 top-0 h-full px-4 text-[#6d5e8d] flex items-center justify-center"
                  type="button"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    visibility
                  </span>
                </button>
              </div>
            </div>
            {/* Remember Me Toggle */}
            <div className="flex items-center gap-2 py-2">
              <input
                className="rounded border-[#dedae7] text-primary focus:ring-primary h-4 w-4"
                id="remember"
                type="checkbox"
              />
              <label
                className="text-sm text-[#6d5e8d] dark:text-[#a195bc]"
                htmlFor="remember"
              >
                Remember this device for 30 days
              </label>
            </div>
            {/* Primary Login Button */}
            <button
              className="flex w-full cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-primary text-white text-base font-bold transition-opacity hover:opacity-90 active:scale-[0.98]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login to Dashboard"}
            </button>
          </form>
          {/* Bottom Toggle Section */}
          <div className="bg-[#f8f7fb] dark:bg-[#150f23]/50 border-t border-[#dedae7] dark:border-[#2d2445] px-8 py-4 flex items-center justify-center gap-2">
            <p className="text-[#6d5e8d] dark:text-[#a195bc] text-sm">
              Don't have an account?
            </p>
            <button className="text-primary text-sm font-bold hover:underline">
              Request access
            </button>
          </div>
        </div>
      </main>
      {/* Footer Decoration */}
      <footer className="p-8 flex flex-col items-center">
        <div className="flex gap-6 mb-4">
          <a
            className="text-[#6d5e8d] dark:text-[#6d5e8d] text-xs hover:text-primary transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-[#6d5e8d] dark:text-[#6d5e8d] text-xs hover:text-primary transition-colors"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-[#6d5e8d] dark:text-[#6d5e8d] text-xs hover:text-primary transition-colors"
            href="#"
          >
            System Status
          </a>
        </div>
        <p className="text-[#6d5e8d]/50 text-[10px] uppercase tracking-widest font-medium">
          © 2024 Nexus Marketing Group LLC
        </p>
      </footer>
    </div>
  );
};

export default Login;

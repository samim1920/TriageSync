
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  UserRound,
  Shield,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const [loginType, setLoginType] = useState("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Change selected account type
  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setError("");
  };

  // Authenticate user through Spring Boot API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Call AuthContext login method
      const loggedInUser = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Verify the selected account type against backend role
      if (loggedInUser.role !== loginType) {
        logout();

        setError(
          `This account is not registered as ${
            loginType === "ADMIN" ? "an Admin" : "a User"
          }. Please select the correct account type.`
        );

        return;
      }

      // Redirect according to backend role
      if (loggedInUser.role === "ADMIN") {
        navigate("/admin/admindashboard", { replace: true });
      } else if (loggedInUser.role === "USER") {
        navigate("/user/dashboard", { replace: true });
      } else {
        logout();
        setError("Invalid account role.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F7FA] flex flex-col">

      {/* Navbar */}
      <nav className="bg-[#173B57] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#12A89D] p-2 rounded-lg">
              <ShieldCheck className="text-white" size={25} />
            </div>

            <span className="text-2xl font-bold text-white">
              Triage<span className="text-[#12A89D]">Sync</span>
            </span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-[#12A89D] transition"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

        </div>
      </nav>

      {/* Main Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">

        <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Left Side */}
          <div className="hidden md:flex flex-col justify-between bg-[#173B57] p-10 text-white relative overflow-hidden">

            <div className="absolute w-72 h-72 bg-[#12A89D]/20 rounded-full -top-20 -right-20" />
            <div className="absolute w-64 h-64 bg-[#FFB547]/10 rounded-full -bottom-20 -left-20" />

            <div className="relative z-10">

              <div className="bg-[#12A89D] w-16 h-16 rounded-xl flex items-center justify-center mb-10">
                <ShieldCheck size={35} />
              </div>

              <h1 className="text-4xl font-bold leading-tight mb-5">
                Welcome Back to
                <span className="text-[#12A89D]"> TriageSync</span>
              </h1>

              <p className="text-gray-300 leading-7">
                A smarter way to manage complaints, track issues and
                improve service delivery through transparency.
              </p>

            </div>

            <div className="relative z-10 space-y-5">

              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#12A89D]" size={22} />
                <span>Secure Authentication</span>
              </div>

              <div className="flex items-center gap-3">
                <ArrowRight className="text-[#12A89D]" size={22} />
                <span>Track Your Complaints</span>
              </div>

              <p className="text-sm text-gray-400 pt-5 border-t border-white/20">
                © 2026 TriageSync. All rights reserved.
              </p>

            </div>
          </div>

          {/* Right Side */}
          <div className="p-7 sm:p-10 md:p-12">

            <div className="mb-7">

              <p className="text-[#12A89D] font-semibold text-sm mb-2">
                ACCOUNT LOGIN
              </p>

              <h2 className="text-3xl font-bold text-[#173B57] mb-3">
                Sign In
              </h2>

              <p className="text-gray-500">
                Select your account type and enter your credentials.
              </p>

            </div>

            {/* Login Type Selection */}
            <div className="grid grid-cols-2 gap-3 mb-7">

              <button
                type="button"
                onClick={() => handleLoginTypeChange("USER")}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 font-semibold transition ${
                  loginType === "USER"
                    ? "border-[#12A89D] bg-[#12A89D]/10 text-[#12A89D]"
                    : "border-gray-200 text-gray-500 hover:border-[#12A89D]"
                }`}
              >
                <UserRound size={20} />
                User Login
              </button>

              <button
                type="button"
                onClick={() => handleLoginTypeChange("ADMIN")}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 font-semibold transition ${
                  loginType === "ADMIN"
                    ? "border-[#173B57] bg-[#173B57]/10 text-[#173B57]"
                    : "border-gray-200 text-gray-500 hover:border-[#173B57]"
                }`}
              >
                <Shield size={20} />
                Admin Login
              </button>

            </div>

            {/* Selected Account */}
            <div className="mb-6 flex items-center gap-3 p-3 rounded-lg bg-[#F2F7FA]">

              {loginType === "USER" ? (
                <UserRound className="text-[#12A89D]" size={22} />
              ) : (
                <Shield className="text-[#173B57]" size={22} />
              )}

              <div>
                <p className="font-semibold text-[#173B57]">
                  {loginType === "USER"
                    ? "User Account"
                    : "Administrator Account"}
                </p>

                <p className="text-xs text-gray-500">
                  {loginType === "USER"
                    ? "Access your complaints and profile"
                    : "Access administration and management"}
                </p>
              </div>

            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>

                <label className="block text-sm font-semibold text-[#202B38] mb-2">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="username"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#12A89D] focus:ring-2 focus:ring-[#12A89D]/20 transition"
                    required
                  />

                </div>
              </div>

              {/* Password */}
              <div>

                <label className="block text-sm font-semibold text-[#202B38] mb-2">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#12A89D] focus:ring-2 focus:ring-[#12A89D]/20 transition"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#173B57]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center text-sm">

                <label className="flex items-center gap-2 text-gray-600">
                  <input
                    type="checkbox"
                    className="accent-[#12A89D]"
                  />
                  Remember me
                </label>

              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed ${
                  loginType === "ADMIN"
                    ? "bg-[#173B57] hover:bg-[#102D43]"
                    : "bg-[#12A89D] hover:bg-[#0E8E85]"
                }`}
              >
                {loading
                  ? "Signing In..."
                  : `Sign In as ${loginType === "ADMIN" ? "Admin" : "User"}`}

                {!loading && <ArrowRight size={19} />}
              </button>

            </form>

            {/* Register Link - Only for User */}
            {loginType === "USER" && (
              <p className="text-center text-gray-600 mt-8 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#12A89D] font-bold hover:underline"
                >
                  Create Account
                </Link>
              </p>
            )}

            {/* Admin Notice */}
            {loginType === "ADMIN" && (
              <p className="text-center text-gray-500 mt-8 text-sm">
                Administrator access is restricted to authorized accounts.
              </p>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;

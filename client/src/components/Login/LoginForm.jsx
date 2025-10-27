import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InputField from "./InputField";
import Logo from "../common/Logo";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect to home page on successful login
        navigate("/");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[576px] flex flex-col items-center gap-1 p-8 bg-white/95 border border-[rgba(167,243,208,0.7)] rounded-[44px] shadow-[rgb(255,255,255)_0px_24px_48px_-32px] text-[#064e3b]">
      {/* Logo positioned at top */}
      <div className="absolute -top-4 p-2 bg-white  rounded-full">
        <Logo />
      </div>

      {/* Header Section */}
      <div className="flex flex-col items-center gap-4 w-full text-center mt-8">
        <span className="flex items-center px-4 py-1 bg-[#ecfdf5] text-[#047857] text-xs font-semibold tracking-[3.6px] uppercase rounded-full">
          Farmer Portal
        </span>
        <h1 className="text-[30px] font-bold leading-9 tracking-[-0.6px] text-[#022c22] font-['Inter']">
          Farmer Login
        </h1>
        <p className="text-sm leading-5 text-[rgba(6,78,59,0.75)] max-w-96">
          Secure access to your farm storefront and logistics tools. Enter your credentials to continue.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-5/6" aria-label="Farmer login form">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <InputField
            label="Email"
            type="email"
            name="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mt-4">
          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          aria-label="Log in to AgriLink"
          className={`w-full mt-6 inline-flex items-center justify-center px-6 py-3 bg-[#10b981] text-white font-semibold text-center rounded-full transition-all shadow-[rgba(40,86,56,0.65)_0px_30px_80px_-40px] ${
            loading
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-emerald-600 hover:shadow-lg"
          }`}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      {/* Sign Up Link */}
      <p className="text-sm leading-5 text-[rgba(6,78,59,0.75)]">
        Don't have an account?{" "}
        <Link to="/register" className="inline text-sm font-semibold leading-5 text-[#047857] hover:underline">
          Sign Up
        </Link>
        &nbsp;/&nbsp;
        <Link to="/forgot-password" className="inline text-sm font-semibold leading-5 text-[#047857] hover:underline">
          Forgot Password?
        </Link>
      </p>

      {/* Background gradient overlay */}
      <div className="absolute inset-0 -z-10 rounded-[48px] pointer-events-none bg-[radial-gradient(circle_at_center_top,rgba(35,97,69,0.15),rgba(0,0,0,0)_60%),radial-gradient(circle_at_center_bottom,rgba(52,120,88,0.12),rgba(0,0,0,0)_55%)]" />
    </div>
  );
};

export default LoginForm;

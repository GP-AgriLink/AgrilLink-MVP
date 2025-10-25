import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "./InputField";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, _setErrors] = useState({});
  const [loading, _setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
  };

  return (
    <div className="md:w-1/2 p-10 flex flex-col justify-center bg-white rounded-3xl">
      <div className="text-center mb-6">
        <div className="bg-emerald-100 text-emerald-700 px-5 py-1.5 rounded-full text-xs font-bold inline-block tracking-widest mb-4">
          FARMER PORTAL
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Farmer Login
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Secure access to your farm storefront and logistics tools.
          <br />
          Enter your credentials to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left mt-6">
        <InputField
          label="Email"
          type="email"
          name="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />
        
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-emerald-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-emerald-500 text-white rounded-full py-3 font-semibold transition-all shadow-md mt-6 ${
            loading
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-emerald-600 hover:shadow-lg"
          }`}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-emerald-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;

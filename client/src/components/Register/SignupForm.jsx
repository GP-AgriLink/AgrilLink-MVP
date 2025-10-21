import {useState} from "react";
import InputField from "./InputField";
import {registerFarmer} from "../../services/farmerService";
import {Link} from "react-router-dom";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const mapBackendErrors = (backendErrors) => {
    const errObj = {};
    backendErrors.forEach((err) => {
      errObj[err.param] = err.msg;
    });
    return errObj;
  };

  const validateLocal = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");

    const localErrors = validateLocal();
    setErrors(localErrors);
    if (Object.keys(localErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await registerFarmer({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      });

      setSuccessMsg("✅ Registration successful!");
      localStorage.setItem("token", response.token);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
      });
      setErrors({});
    } catch (backendErrors) {
      setErrors(mapBackendErrors(backendErrors));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:w-1/2 p-10 flex flex-col justify-center bg-white rounded-3xl">
      <div className="text-center mb-6">
        <div className="bg-emerald-100 text-emerald-700 px-5 py-1.5 rounded-full text-xs font-bold inline-block tracking-widest mb-4">
          FARMER PORTAL
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Farmer Sign Up
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Secure access to your farm storefront and logistics tools.
          <br />
          Enter your credentials to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            name="firstName"
            type="text"
            placeholder="Ex: Jhon"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />

          <InputField
            label="Last Name"
            name="lastName"
            type="text"
            placeholder="Ex: Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>

        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <InputField
          label="Phone Number"
          name="phoneNumber"
          type="text"
          placeholder="+20123456789"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={errors.phoneNumber}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
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
          {loading ? "Submitting..." : "Sign Up"}
        </button>

        {successMsg && (
          <p className="text-emerald-600 text-center text-sm mt-3">
            {successMsg}
          </p>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          Already Signed Up?{" "}
          <Link to="/login" className="text-emerald-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;

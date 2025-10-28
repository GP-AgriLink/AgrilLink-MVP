import React, {useState} from "react";

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // switch between text type and password type on input field
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="relative">
      {/* Label */}
      <label className="inline text-sm font-semibold leading-5 text-[#064e3b]">
        {label}
      </label>

      {/* Input container */}
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full mt-2 px-4 py-3 text-sm leading-5 text-[#022c22] bg-white border rounded-2xl transition-all
            placeholder:text-gray-300
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              error
                ? "border-red-400 focus:ring-red-400"
                : "border-[rgba(167,243,208,0.7)] focus:ring-emerald-600"
            }`}
        />

        {/* Toggle password visibility button */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-emerald-600 mt-2 transition-transform duration-300 ease-in-out"
            tabIndex={-1}
          >
            <i
              className={`far ${
                showPassword ? "fa-eye" : "fa-eye-slash"
              } transform transition-transform duration-300 ease-in-out ${
                showPassword ? "rotate-180" : "rotate-0"
              }`}
            ></i>
          </button>
        )}
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputField;

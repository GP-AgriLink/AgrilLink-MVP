const InputField = ({
  label,
  type = "text",
  name,
  value = "",
  onChange,
  placeholder,
  error,
  icon: Icon,
  disabled = false,
}) => {
  return (
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
        {Icon && <Icon className="mr-2 text-gray-500" />}
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-4 py-2 
          focus:outline-none transition-all duration-200
          placeholder-gray-300
          ${
            error
              ? "border-red-400 focus:ring-red-400"
              : disabled
              ? "border-emerald-200 focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 bg-gray-50"
              : "border-emerald-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
          }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputField;

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
}) => {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all
    placeholder-gray-300
    ${
      error
        ? "border-red-400 focus:ring-red-400"
        : "border-emerald-200 focus:border-emerald-400"
    }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputField;

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
      <label className="inline text-sm font-semibold leading-5 text-[#064e3b]">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
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
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputField;

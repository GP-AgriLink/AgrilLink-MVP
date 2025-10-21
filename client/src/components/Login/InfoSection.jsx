const InfoSection = () => {
  return (
    <div className="md:w-1/2 p-8 bg-white flex flex-col justify-center text-left rounded-3xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome back, growers.
      </h2>
      <p className="text-gray-600 text-base mb-6 leading-relaxed">
        Access your dashboard to update your harvest availability, manage
        farm store orders, and connect with nearby co-ops.
      </p>

      <h3 className="text-emerald-600 uppercase tracking-wider text-xs font-bold mb-3">
        Need Assistance?
      </h3>
      <ul className="text-gray-700 text-sm space-y-2.5 list-none">
        <li className="flex items-start">
          <span className="text-emerald-500 mr-2">•</span>
          <span>
            Reach our support team at{" "}
            <a
              href="mailto:support@agrilink.com"
              className="text-emerald-600 hover:underline"
            >
              support@agrilink.com
            </a>
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-emerald-500 mr-2">•</span>
          <span>Join monthly grower workshops and trainings</span>
        </li>
        <li className="flex items-start">
          <span className="text-emerald-500 mr-2">•</span>
          <span>Discover distribution partners within your region</span>
        </li>
      </ul>
    </div>
  );
};

export default InfoSection;

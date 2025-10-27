const InfoSection = () => {
  return (
    <div className="hidden md:flex md:flex-1 max-w-[448px] flex-col gap-6 p-10 bg-white/80 border border-[rgba(167,243,208,0.7)] rounded-[40px] shadow-[rgb(255,255,255)_0px_24px_48px_-32px] text-[#022c22]">
      <h2 className="text-[30px] font-semibold leading-[36px] tracking-[-0.6px] text-[#022c22] font-['Inter']">
        Welcome back, growers.
      </h2>
      <p className="text-[rgba(6,78,59,0.75)]">
        Access your dashboard to update your harvest availability, manage
        farm store orders, and connect with nearby co-ops.
      </p>

      <div className="mt-auto text-sm leading-5 text-[rgba(6,78,59,0.7)]">
        <p className="text-sm font-semibold tracking-[3.5px] uppercase text-[#047857] mb-4">
          Need assistance?
        </p>
        <ul className="text-sm leading-5 text-[rgba(6,78,59,0.7)] space-y-2 list-none">
          <li className="flex items-start">
            <span>• Reach our support team at agrilink.corp@gmail.com</span>
          </li>
          <li className="flex items-start mt-2">
            <span>• Join monthly grower workshops and trainings</span>
          </li>
          <li className="flex items-start mt-2">
            <span>• Discover distribution partners within your region</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InfoSection;

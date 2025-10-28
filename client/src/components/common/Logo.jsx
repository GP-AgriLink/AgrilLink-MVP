// src/components/common/Logo.jsx

import { Link } from 'react-router-dom';


function Logo({ className }) {
  return (
    <Link to="/" className={`flex items-center gap-3 rounded-full border border-emerald-200 shadow-sm text-emerald-900 font-semibold tracking-[2.8px] uppercase px-4 py-2 no-underline transition-transform hover:-translate-y-0.5 ${className}`}>
      {/* Logo Icon */}
      <span className="w-9 h-9 rounded-full grid place-items-center bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-500 text-white">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.5 3.75c5.25.75 9 5.25 9.75 9.75.75-4.5 4.5-9 9.75-9.75-.75 5.25-3.75 9-9.75 11.25 2.25 1.5 5.25 3.75 6 6-4.5-1.5-7.5-3.75-9-6-1.5 2.25-4.5 4.5-9 6 .75-2.25 3.75-4.5 6-6C8.25 12.75 5.25 9 4.5 3.75Z"></path>
        </svg>
      </span>
      
      <span className="flex flex-col">
        <span className="text-[10.4px] tracking-[5.2px] text-emerald-700/70">AgriLink</span>
        <span className="font-bold leading-4 tracking-[2.8px] text-emerald-950">Fresh Produce, Nearby</span>
      </span>
    </Link>
  )
}

export default Logo;
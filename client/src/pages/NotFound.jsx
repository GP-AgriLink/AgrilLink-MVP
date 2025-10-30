import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative max-h-screen flex items-center justify-center py-10 px-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="relative flex flex-col items-center justify-center max-w-4xl w-full text-center z-10 gap-6">
        <h1 className="text-4xl md:text-5xl font-semibold text-emerald-900 mb-2">
          Page Not Found
        </h1>

        <div className="flex items-center justify-center" aria-label="404">
          <span className="text-[180px] md:text-[200px] font-extrabold leading-[180px] md:leading-[200px] text-emerald-900">
            4
          </span>

          <div className="h-[180px] md:h-[200px] w-[180px] md:w-[200px] ml-3">
            <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none">
              <defs>
                <linearGradient id="paint0_linear" x1="380.263" y1="17.1053" x2="-100.605" y2="197.728" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10b981" />
                  <stop offset="1" stopColor="#14b8a6" stopOpacity=".75" />
                </linearGradient>
                <linearGradient id="paint1_linear" x1="352.632" y1="44.7368" x2="-54.5269" y2="197.673" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10b981" />
                  <stop offset="1" stopColor="#14b8a6" stopOpacity=".75" />
                </linearGradient>
                <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200.211 197.097) rotate(67) scale(152.632 152.632)">
                  <stop stopColor="#fff" stopOpacity=".5" />
                  <stop offset="1" stopColor="#fff" stopOpacity=".02" />
                </radialGradient>
                <linearGradient id="paint3_linear" x1="200" y1="172.368" x2="200" y2="223.684" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f0fdfa" />
                  <stop offset="1" stopColor="#5eead4" />
                </linearGradient>
              </defs>
              <g clipPath="url(#clip0)">
                <g>
                  <path opacity=".45" d="M200 377.632c99.557 0 180.263-80.707 180.263-180.264 0-99.5562-80.706-180.2628-180.263-180.2628-99.557 0-180.2632 80.7066-180.2632 180.2628 0 99.557 80.7062 180.264 180.2632 180.264z" fill="url(#paint0_linear)" fillOpacity=".9" />
                  <path opacity=".45" d="M200 350c84.296 0 152.632-68.336 152.632-152.632S284.296 44.7368 200 44.7368c-84.296 0-152.6316 68.3352-152.6316 152.6312S115.704 350 200 350z" fill="url(#paint1_linear)" fillOpacity=".9" />
                  <path d="M321.053 198.026c0 66.479-54.185 120.395-121.053 120.395-66.869 0-121.0527-53.916-121.0527-120.395C78.9473 131.547 133.131 77.6316 200 77.6316c66.868 0 121.053 53.9154 121.053 120.3944z" stroke="#059669" strokeOpacity=".85" strokeWidth="3.5" />
                </g>
                <g opacity=".4">
                  <path d="M52.4787 37.2096V379.07M151.316 37.2096V379.07M250.153 37.2096V379.07M348.991 37.2096V379.07" stroke="#059669" strokeOpacity=".85" />
                  <path d="M370.349 61.1997H28.4884M370.349 160.037H28.4884M370.349 258.875H28.4884M370.349 357.712H28.4884" stroke="#059669" strokeOpacity=".85" />
                </g>
                <path d="M202.632 0V400" stroke="#059669" strokeOpacity=".85" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M400 202.632H0" stroke="#059669" strokeOpacity=".85" strokeWidth="3.5" strokeLinecap="round" />
                <g className="animate-spin origin-center" style={{ animationDuration: '4s', transformOrigin: '200px 200px' }}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M89.987 91.4607L201.23 197.347 202.333 44.4422C181.739 44.1448 160.75 48.0345 140.573 56.5993c-19.674 8.3509-36.686 20.3444-50.586 34.8614z" fill="url(#paint2_radial)" />
                  <g filter="url(#filter0_d)">
                    <path d="M202.39 59.8814c7.751-.0005 14.035-6.2844 14.034-14.0353-.001-7.7519-6.284-14.035-14.036-14.0346-7.75-.0004-14.034 6.2839-14.034 14.0353.001 7.751 6.284 14.035 14.036 14.0346zM205.025 200.441l-.005-154.5943-5.262.0005.005 154.5938 5.262.001z" fill="#059669" fillOpacity=".85" />
                  </g>
                </g>
                <g opacity=".98" filter="url(#filter1_d)">
                  <path d="M200 223.684c13.807 0 25-11.487 25-25.658 0-14.17-11.193-25.658-25-25.658s-25 11.488-25 25.658c0 14.171 11.193 25.658 25 25.658z" fill="url(#paint3_linear)" />
                </g>
              </g>
              <defs>
                <filter id="filter0_d" x="176.354" y="25.8115" width="52.0701" height="192.63" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="6" />
                  <feGaussianBlur stdDeviation="6" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
                <filter id="filter1_d" x="155" y="162.368" width="90" height="91.3157" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="10" />
                  <feGaussianBlur stdDeviation="10" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
                <clipPath id="clip0">
                  <rect width="400" height="400" fill="#fff" />
                </clipPath>
              </defs>
            </svg>
          </div>

          <span className="text-[180px] md:text-[200px] font-extrabold leading-[180px] md:leading-[200px] ml-3 text-emerald-900">
            4
          </span>
        </div>

        <div className="flex items-center text-center flex-col sm:flex-row">
          <p className="text-xl font-semibold text-emerald-800">
            We couldn't find this page
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Go Back
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 shadow-md hover:-translate-y-0.5"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

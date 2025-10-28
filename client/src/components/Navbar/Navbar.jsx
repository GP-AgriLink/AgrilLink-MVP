import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <header className="font-['Inter'] bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-100/70 shadow-[0_-4px_16px_rgba(6,78,59,0.7)] rounded-b-2xl">
      <div className="w-5/6 mx-auto flex justify-between items-center px-6 py-5">
        {/* Logo Area */}
        <Logo />

        {/* User Actions Area */}
        <div className="flex items-center gap-3">
          {!user ? (
            // Show For Farmers dropdown with Login/Register when user is logged out
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 font-semibold text-white rounded-full px-6 py-2 transition-all hover:-translate-y-0.5 hover:shadow-md flex items-center gap-2"
              >
                For Farmers
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden z-50">
                  <Link
                    to="/login"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-emerald-900 font-semibold no-underline hover:bg-emerald-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-emerald-700">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                      <polyline points="10 17 15 12 10 7"></polyline>
                      <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-emerald-900 font-semibold no-underline hover:bg-emerald-50 transition-colors border-t border-emerald-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-emerald-700">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <line x1="19" y1="8" x2="19" y2="14"></line>
                      <line x1="22" y1="11" x2="16" y2="11"></line>
                    </svg>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          ) : (
            // Show welcome message dropdown with profile options when user is logged in
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 font-semibold text-white rounded-full px-6 py-2 transition-all hover:-translate-y-0.5 hover:shadow-md flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-white">
                  <circle cx="12" cy="8" r="5"></circle>
                  <path d="M20 21a8 8 0 0 0-16 0"></path>
                </svg>
                <span>Welcome, {user.farmName}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden z-50">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-emerald-900 font-semibold no-underline hover:bg-emerald-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-emerald-700">
                      <circle cx="12" cy="8" r="5"></circle>
                      <path d="M20 21a8 8 0 0 0-16 0"></path>
                    </svg>
                    Profile
                  </Link>
                  <Link
                    to="/edit-profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-emerald-900 font-semibold no-underline hover:bg-emerald-50 transition-colors border-t border-emerald-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-emerald-700">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 text-red-600 font-semibold hover:bg-red-50 transition-colors border-t border-emerald-100 w-full text-left"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-red-600">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <Link to="/cart" className="relative w-12 h-12 rounded-full grid place-items-center bg-white/75 shadow-[0_0_0_1px_rgba(167,243,208,0.7)] no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(167,243,208,1),0_4px_6px_-1px_rgba(0,0,0,0.1)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-emerald-900">
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-emerald-500 text-xs font-semibold text-white">0</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar;
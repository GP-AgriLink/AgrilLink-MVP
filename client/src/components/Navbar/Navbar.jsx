import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo'; 

function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="font-['Inter'] bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-100/70 shadow-[0_-4px_16px_rgba(6,78,59,0.7)] rounded-b-2xl">
      <div className="w-5/6 mx-auto flex justify-between items-center px-6 py-5">
        {/* Logo Area */}
        <Logo /> 

        {/* User Actions Area */}
        <div className="flex items-center gap-3">
          {!user ? (
            // Show Login/Register when user is logged out
            <>
              <div className="flex items-center gap-2 border border-emerald-200/80 rounded-full px-5 py-2 bg-white/60 transition-all hover:bg-white/90">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-emerald-700">
                  <circle cx="12" cy="8" r="5"></circle>
                  <path d="M20 21a8 8 0 0 0-16 0"></path>
                </svg>
                <Link to="/login" className="text-emerald-900 font-semibold no-underline transition-transform hover:-translate-y-0.5">
                  Login
                </Link>
                <span className="text-emerald-900">/</span>
                <Link to="/register" className="text-emerald-900 font-semibold no-underline transition-transform hover:-translate-y-0.5">
                  Sign Up
                </Link>
              </div>
              <Link to="/for-farmers" className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 font-semibold text-white rounded-full px-6 py-2 no-underline transition-all hover:-translate-y-0.5 hover:shadow-md">
                For Farmers
              </Link>
            </>
          ) : (
            // Show welcome message and logout when user is logged in
            <>
              <div className="flex items-center gap-2 border border-emerald-200/80 rounded-full px-5 py-2 bg-white/60">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-emerald-700">
                  <circle cx="12" cy="8" r="5"></circle>
                  <path d="M20 21a8 8 0 0 0-16 0"></path>
                </svg>
                <span className="text-emerald-900 font-semibold">
                  Welcome, {user.farmName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 font-semibold text-white rounded-full px-6 py-2 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Logout
              </button>
            </>
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
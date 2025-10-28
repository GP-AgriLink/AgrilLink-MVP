import React from 'react';
import Logo from '../common/Logo'; 

const PasswordChangedStep = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        
        <Logo className="mb-12" /> 
        
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32">
            <svg viewBox="0 0 200 200" className="w-full h-full">
            
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Password changed!
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          You've Successfully Completed Your Password Reset!
        </p>

        <button
          onClick={onLogin}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-200"
        >
          Log in Now
        </button>

        <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between text-xs text-gray-400">
          <span>© 2025 AgriLink</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangedStep;
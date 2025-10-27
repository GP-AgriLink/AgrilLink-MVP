import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Logo from '../common/Logo'; 

const CheckEmailStep = ({ email, onResend, onBack }) => {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    setCountdown(60); 
    onResend(); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        
        <Logo className="mb-12" /> 
        
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* (SVG code for email with check) */}
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Check your email!
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Thanks! An email was sent to <span className="font-bold text-gray-800">{email}</span>. 
          If you don't get the email, please contact agrilink.corp@gmail.com
        </p>

        <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all mb-4 shadow-lg shadow-emerald-200">
          Open email inbox
        </button>

        <button 
          onClick={handleResend}
          disabled={countdown > 0}
          className="flex items-center justify-center gap-2 text-gray-600 hover:text-emerald-600 transition mx-auto disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">
            Resend email {countdown > 0 && `(${countdown}s)`}
          </span>
        </button>

        <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between text-xs text-gray-400">
          <span>© 2025 AgriLink</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailStep;
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom'; 
import Logo from '../common/Logo'; 

const ForgotPasswordStep = ({ onNext }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email) {
      onNext(email);
    }
  };

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
          Forgot your password?
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Enter your email so that we can send you password reset link
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition text-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all mb-4 shadow-lg shadow-emerald-200"
        >
          Send Email
        </button>

       
        <Link 
          to="/login"
          className="flex items-center justify-center gap-2 text-gray-600 hover:text-emerald-600 transition mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Login</span>
        </Link>

        <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between text-xs text-gray-400">
          <span>© 2025 AgriLink</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordStep;
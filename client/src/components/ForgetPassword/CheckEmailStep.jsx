import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, CheckCircle, ExternalLink } from 'lucide-react';
import Logo from '../common/Logo'; 

const CheckEmailStep = ({ email, onResend, onBackToLogin, isLoading }) => {
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

  const handleOpenEmail = () => {
    // Try to open email client
    const emailDomain = email.split('@')[1];
    let emailUrl = 'mailto:';
    
    // Provide direct links to popular email providers
    if (emailDomain?.includes('gmail')) {
      emailUrl = 'https://mail.google.com';
    } else if (emailDomain?.includes('yahoo')) {
      emailUrl = 'https://mail.yahoo.com';
    } else if (emailDomain?.includes('outlook') || emailDomain?.includes('hotmail')) {
      emailUrl = 'https://outlook.live.com';
    }
    
    window.open(emailUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-5 gap-0">
          
          {/* Left Side - Visual Section */}
          <div className="relative bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 p-8 md:p-12 md:col-span-2 flex flex-col justify-center items-center text-white">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 text-center">
              {/* Animated Icon */}
              <div className="mb-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 animate-ping">
                    <div className="w-32 h-32 bg-white/30 rounded-full"></div>
                  </div>
                  <div className="relative w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                    <div className="relative">
                      <Mail className="w-14 h-14 text-white" />
                      <div className="absolute -bottom-1 -right-1 bg-emerald-400 rounded-full p-1.5">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Email Sent!
              </h2>
              <p className="text-emerald-50 text-sm md:text-base max-w-xs mx-auto">
                Check your inbox and follow the instructions to reset your password securely.
              </p>
            </div>
          </div>

          {/* Right Side - Content Section */}
          <div className="p-5 md:p-8 md:col-span-3 flex flex-col justify-center">
            {/* Logo for mobile */}
            <div className="flex justify-center mb-3 md:hidden">
              <Logo />
            </div>
            
            {/* Logo for desktop */}
            <div className="hidden md:flex justify-end mb-4">
              <Logo />
            </div>

        {/* Header - More compact */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1.5">
          Check your email!
        </h1>
        <p className="text-gray-600 text-xs mb-0.5">
          If an account exists, we've sent a reset link to
        </p>
        <p className="font-semibold text-emerald-600 text-sm mb-3">
          {email}
        </p>
        
        {/* Info Box - More compact */}
        <div className="bg-emerald-50 border-l-4 border-emerald-400 rounded-lg p-2 mb-3">
          <p className="text-xs text-gray-700">
            If the account exists, you'll receive a reset link. Link expires in <span className="font-semibold text-emerald-600">10 min</span>.
          </p>
        </div>

        {/* Buttons Row - Streamlined */}
        <div className="grid md:grid-cols-2 gap-2.5 mb-3">
          {/* Open Email Button */}
          <button 
            onClick={handleOpenEmail}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2.5 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Open Email
          </button>

          {/* Resend Button */}
          <button 
            onClick={handleResend}
            disabled={countdown > 0 || isLoading}
            className={`py-2.5 rounded-lg font-semibold transition-all text-sm ${
              countdown > 0 || isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resending...
              </span>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              'Resend Email'
            )}
          </button>
        </div>

        {/* Help Text - Compact grid */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <p className="text-xs text-gray-700 mb-1.5 font-semibold">
            Didn't receive it?
          </p>
          <div className="grid md:grid-cols-2 gap-x-3 gap-y-0.5">
            <p className="text-xs text-gray-600">• Check spam folder</p>
            <p className="text-xs text-gray-600">• Verify email address</p>
            <p className="text-xs text-gray-600">• Wait a few minutes</p>
            <p className="text-xs text-gray-600">• Unregistered? No link</p>
          </div>
        </div>

        {/* Back to Login - Inline footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <button 
            onClick={onBackToLogin}
            className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-600 transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-medium">Back to Login</span>
          </button>
          
          <div className="text-xs text-gray-400">
            © 2025 AgriLink
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailStep;
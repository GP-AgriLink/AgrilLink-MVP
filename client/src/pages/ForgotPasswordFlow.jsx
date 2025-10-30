import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ForgotPasswordStep from "../components/ForgetPassword/ForgotPasswordStep";
import CheckEmailStep from "../components/ForgetPassword/CheckEmailStep";
import { sanitizeEmail } from "../utils/validation";

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

  const handleSendEmail = async (userEmail) => {
    setIsLoading(true);
    
    try {
      const sanitizedEmail = sanitizeEmail(userEmail);
      
      await axios.post(`${API_URL}/api/farmers/forgot-password`, { 
        email: sanitizedEmail 
      });
      
      setEmail(sanitizedEmail);
      setStep(2);
      
      toast.success("If this email exists, a password reset link has been sent!", {
        position: "top-right",
        autoClose: 4000,
      });
    } catch (err) {
      console.error("Forgot password error:", err);
      
      setEmail(userEmail);
      setStep(2);
      
      toast.info("If this email exists in our system, you will receive a reset link shortly.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    
    setIsLoading(true);
    
    try {
      await axios.post(`${API_URL}/api/farmers/forgot-password`, { 
        email 
      });
      
      toast.success("Reset email sent! Please check your inbox.", {
        position: "top-right",
        autoClose: 4000,
      });
    } catch (err) {
      console.error("Resend error:", err);
      
      toast.info("If this email exists in our system, you will receive a reset link shortly.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      {step === 1 && (
        <ForgotPasswordStep 
          onNext={handleSendEmail} 
          isLoading={isLoading}
          onBackToLogin={handleBackToLogin}
        />
      )}
      {step === 2 && (
        <CheckEmailStep
          email={email}
          onResend={handleResend}
          onBackToLogin={handleBackToLogin}
          isLoading={isLoading}
        />
      )}
    </>
  );
}

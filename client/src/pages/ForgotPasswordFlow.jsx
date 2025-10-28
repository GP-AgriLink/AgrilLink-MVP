import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ForgotPasswordStep from "../components/ForgetPassword/ForgotPasswordStep";
import CheckEmailStep from "../components/ForgetPassword/CheckEmailStep";
import { sanitizeEmail } from "../utils/validation";

/**
 * ForgotPasswordFlow Component
 * 
 * Security Implementation:
 * - Always proceeds to step 2 regardless of whether email exists (prevents user enumeration)
 * - Shows generic success messages that don't leak user existence information
 * - Sanitizes email input before sending to backend
 * - Uses toast notifications for smooth, non-intrusive user feedback
 * - Implements proper error handling without exposing sensitive information
 */

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

  const handleSendEmail = async (userEmail) => {
    setIsLoading(true);
    
    try {
      // Sanitize email before sending
      const sanitizedEmail = sanitizeEmail(userEmail);
      
      // Call backend forgot-password endpoint
      await axios.post(`${API_URL}/api/farmers/forgot-password`, { 
        email: sanitizedEmail 
      });
      
      // Always move to step 2 and show success message
      // This prevents leaking whether the email exists or not
      setEmail(sanitizedEmail);
      setStep(2);
      
      toast.success("If this email exists, a password reset link has been sent!", {
        position: "top-right",
        autoClose: 4000,
      });
    } catch (err) {
      console.error("Forgot password error:", err);
      
      // SECURITY: Always show the same generic message regardless of error
      // This prevents attackers from discovering which emails are registered
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
      
      // SECURITY: Always show success message regardless of whether email exists
      toast.success("Reset email sent! Please check your inbox.", {
        position: "top-right",
        autoClose: 4000,
      });
    } catch (err) {
      console.error("Resend error:", err);
      
      // SECURITY: Show generic message even on error
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

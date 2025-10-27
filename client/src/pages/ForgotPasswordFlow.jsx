import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ForgotPasswordStep from "../components/auth/ForgotPasswordStep";
import CheckEmailStep from "../components/auth/CheckEmailStep";
import PasswordChangedStep from "../components/auth/PasswordChangedStep";

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendEmail = async (userEmail) => {
    setError("");
    console.log("Trying to send email...", userEmail);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    /*
    try {
      await axios.post('/api/farmers/forgot-password', { email: userEmail });
      setEmail(userEmail);
      setStep(2); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
    */

    setEmail(userEmail);
    setStep(2);
  };

  const handleResend = async () => {
    console.log("Resending email to:", email);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      {step === 1 && <ForgotPasswordStep onNext={handleSendEmail} />}
      {step === 2 && (
        <CheckEmailStep
          email={email}
          onResend={handleResend}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && <PasswordChangedStep onLogin={handleLogin} />}

      <div className="fixed bottom-4 right-4 flex gap-2 bg-white rounded-lg shadow-lg p-2 z-50">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Previous
        </button>
        <button
          onClick={() => setStep(Math.min(3, step + 1))}
          disabled={step === 3}
          className="px-4 py-2 bg-emerald-500 text-white rounded disabled:opacity-50 hover:bg-emerald-600 transition"
        >
          Next
        </button>
        <span className="px-4 py-2 text-gray-600">Step {step}/3</span>
      </div>
    </>
  );
}

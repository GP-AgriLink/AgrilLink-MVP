import InfoSection from "../components/Register/InfoSection";
import SignupForm from "../components/Register/SignupForm";

const FarmerSignup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-10 px-4">
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl gap-0">
        <InfoSection />
        <SignupForm />
      </div>
    </div>
  );
};

export default FarmerSignup;

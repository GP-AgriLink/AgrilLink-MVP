import InfoSection from "../components/Register/InfoSection";
import SignupForm from "../components/Register/SignupForm";

const FarmerSignup = () => {
  return (
    <div className="relative min-h-fit flex items-center justify-center py-6 px-6">
      <div className="relative flex flex-col md:flex-row items-center justify-between max-w-[1024px] w-full gap-12 z-10">
        <InfoSection />
        <SignupForm />
      </div>
    </div>
  );
};

export default FarmerSignup;

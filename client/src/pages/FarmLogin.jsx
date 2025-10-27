import React from 'react';
import InfoSection from '../components/Login/InfoSection';
import LoginForm from '../components/Login/LoginForm';

const FarmerLogin = () => {
  return (
    <div className="relative min-h-fit bg-[#f5faf6] flex items-center justify-center py-6 px-6">
      <div className="relative flex flex-col md:flex-row items-center justify-between max-w-[1024px] w-full gap-12 z-10">
        <InfoSection />
        <LoginForm />
      </div>
    </div>
  );
};

export default FarmerLogin;

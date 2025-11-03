import React from 'react';
import { FaRocket, FaPlayCircle, FaUniversalAccess, FaMapMarkerAlt, FaFirstAid, FaFileAlt, FaFingerprint } from 'react-icons/fa';   

const StatCard = ({ value, label }) => (
  <div className="text-center">
    <h3 className="text-2xl md:text-3xl font-bold font-display text-text-primary">{value}</h3>
    <p className="text-sm text-text-secondary">{label}</p>
  </div>
);


const AppMockup = () => (
  <div className="relative w-full max-w-[300px] aspect-[9/19] scale-95 origin-bottom-right">
    <div className="absolute inset-0 bg-accent rounded-[2.5rem] blur-lg opacity-20 transform rotate-3"></div>
    
    <div className="relative w-full h-full transform rotate-3">
      <div className="absolute inset-0 w-full h-full rounded-[2.5rem] bg-gradient-to-br from-background-secondary to-border p-1 shadow-2xl">
        
        <div className="w-full h-full rounded-[2.4rem] bg-gray-900 p-2 flex flex-col">
          
          <div className="w-full h-10 flex justify-center items-center">
             <div className="w-16 h-2 bg-gray-700 rounded-full"></div>
          </div>

          <div className="w-full h-full rounded-[2.0rem] bg-background-primary overflow-hidden flex flex-col">
            
            <div className="flex justify-between items-center w-full px-4 pt-4">
              <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                <FaUniversalAccess size={16} />
              </div>
              <span className="text-lg font-bold text-text-primary font-display">Smart Inclusion</span>
              <div className="w-8 h-8 rounded-full bg-background-secondary border border-border flex items-center justify-center text-text-secondary text-sm font-semibold">JS</div>
            </div>
            
            <div className="flex flex-col gap-4 w-full p-4 mt-4">
              <div className="bg-background-secondary p-4 rounded-xl flex items-center gap-4 border border-border shadow-sm hover:shadow-md transition-shadow">
                <FaMapMarkerAlt className="text-accent text-xl" />
                <span className="text-text-primary font-semibold text-lg">Find Accessible Places</span>
              </div>
              <div className="bg-background-secondary p-4 rounded-xl flex items-center gap-4 border border-border shadow-sm hover:shadow-md transition-shadow">
                <FaFirstAid className="text-red-500 text-xl" />
                <span className="text-text-primary font-semibold text-lg">Emergency SOS</span>
              </div>
              <div className="bg-background-secondary p-4 rounded-xl flex items-center gap-4 border border-border shadow-sm hover:shadow-md transition-shadow">
                <FaFileAlt className="text-blue-500 text-xl" />
                <span className="text-text-primary font-semibold text-lg">Government Schemes</span>
              </div>
            </div>
          </div>

          <div className="w-full h-16 flex justify-center items-center">
            <div className="w-12 h-12 rounded-full border-2 border-gray-700 flex items-center justify-center">
              <FaFingerprint className="text-gray-600" size={24} />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
);
const Hero = ({ onRegisterClick }) => {
  return (
    <section id="home" className="container mx-auto min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 pt-24 pb-12">
      
      <div className="w-full max-w-[280px] lg:hidden mb-12">
        <AppMockup />
      </div>

      <div className="flex-1 text-center lg:text-left max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-text-primary leading-tight">
          Your Gateway to an
          <span className="text-accent"> Accessible World</span>
        </h1>
        <p className="text-lg text-text-secondary mt-6 max-w-lg mx-auto lg:mx-0">
          Smart Inclusion empowers persons with disabilities by providing real-time accessibility insights, instant emergency support, and easy access to government schemes — all in one place.”
        </p>

        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-10">
          <button
            onClick={onRegisterClick}
            className="cursor-pointer flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold py-3 px-6 rounded-lg text-lg transition-all transform hover:scale-105"
          >
            <FaRocket />
            Get Started
          </button>
          <button className="cursor-pointer flex items-center justify-center gap-2 text-text-primary font-semibold py-3 px-6 rounded-lg text-lg bg-background-secondary hover:bg-border transition-all">
            <FaPlayCircle />
            Watch Demo
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-lg mx-auto lg:mx-0">
          <StatCard value="10,000+" label="Accessible Places" />
          <StatCard value="5,000+" label="Volunteers" />
          <StatCard value="500+" label="Emergencies Handled" />
          <StatCard value="100+" label="Govt. Schemes" />
        </div>
      </div>

      <div className="hidden lg:flex flex-1 justify-center items-center mt-12 lg:mt-0">
        <AppMockup />
      </div>
    </section>
  );
};

export default Hero;
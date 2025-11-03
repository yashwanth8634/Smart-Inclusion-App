import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import AboutSection from '../components/AboutPage'; // 1. Import
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('login');

  const openModal = (tab) => {
    setModalTab(tab);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-background-primary">
      <Navbar
        onLoginClick={() => openModal('login')}
        onRegisterClick={() => openModal('register')}
      />
      <Hero 
        onRegisterClick={() => openModal('register')}
      />
      <Features />
      <AboutSection /> {/* 2. Add the component here */}
      <Footer />

      <AuthModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialTab={modalTab}
      />
    </div>
  );
}

export default LandingPage;
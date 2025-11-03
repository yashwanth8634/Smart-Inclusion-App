import React from 'react';
import { FaUniversalAccess, FaUsers, FaBullseye } from 'react-icons/fa';

const AboutSection = () => {
  return (
    <div id="about" className="bg-background-secondary py-20">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <FaUniversalAccess className="text-accent text-6xl mx-auto mb-4" />
          <h1 className="text-4xl font-display font-bold text-text-primary mb-4">
            About Smart Inclusion
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            We are Team NEMESIS, a group of passionate developers dedicated to making the world
            more accessible for everyone. We believe that technology can bridge gaps and
            empower individuals with disabilities to live more independent and confident lives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="bg-background-primary p-8 rounded-lg border border-border">
            <FaBullseye className="text-accent text-4xl mb-3" />
            <h2 className="text-2xl font-display font-bold text-text-primary mb-3">Our Mission</h2>
            <p className="text-text-secondary">
              Our mission is to create a single, reliable platform that provides
              real-time, verified accessibility information. We aim to build a
              community-driven ecosystem where users can find accessible places,
              request help, and connect with a network of willing volunteers.
            </p>
          </div>

          <div className="bg-background-primary p-8 rounded-lg border border-border">
            <FaUsers className="text-accent text-4xl mb-3" />
            <h2 className="text-2xl font-display font-bold text-text-primary mb-3">How It Works</h2>
            <p className="text-text-secondary">
              Our app connects two key groups: PwD users who need information
              and a network of vetted volunteers who want to help. Through our
              "Smart Map," users get personalized filters for their specific needs,
              while volunteers can add new data and respond to SOS alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
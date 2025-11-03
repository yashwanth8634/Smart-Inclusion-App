import React from 'react';
import { FaMapMarkedAlt, FaFirstAid, FaHandHoldingHeart, FaRobot, FaCheck } from 'react-icons/fa';

const FeatureCard = ({ icon, title, children }) => (
  <div className="bg-background-secondary p-6 rounded-lg border border-border shadow-sm">
    <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold font-display text-text-primary mb-2">{title}</h3>
    <div className="text-text-secondary space-y-2">{children}</div>
  </div>
);

const FeatureListItem = ({ children }) => (
  <li className="flex items-center gap-2">
    <FaCheck className="text-accent/70" size={12} />
    <span>{children}</span>
  </li>
);

const Features = () => {
  return (
    <section id="features" className="py-20 bg-background-primary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary">
            Powerful Features for <span className="text-accent">Every Need</span>
          </h2>
          <p className="text-lg text-text-secondary mt-2">
            Designed with accessibility at the core
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard icon={<FaMapMarkedAlt size={24} />} title="Accessibility Maps">
            <p>Real-time maps showing accessible routes, ramps, elevators, and facilities.</p>
            <ul className="mt-2 text-sm">
              <FeatureListItem>Wheelchair accessibility</FeatureListItem>
              <FeatureListItem>Visual impairment support</FeatureListItem>
              <FeatureListItem>Verified user reviews</FeatureListItem>
            </ul>
          </FeatureCard>

          <FeatureCard icon={<FaFirstAid size={24} />} title="Emergency SOS">
            <p>Instant help with one-tap SOS connecting you to nearby volunteers and services.</p>
            <ul className="mt-2 text-sm">
              <FeatureListItem>One-tap emergency alert</FeatureListItem>
              <FeatureListItem>Location sharing</FeatureListItem>
              <FeatureListItem>Volunteer network</FeatureListItem>
            </ul>
          </FeatureCard>

          <FeatureCard icon={<FaHandHoldingHeart size={24} />} title="Government Schemes">
            <p>Centralized portal for all government and NGO schemes with eligibility matching.</p>
            <ul className="mt-2 text-sm">
              <FeatureListItem>Scheme discovery</FeatureListItem>
              <FeatureListItem>Eligibility checking</FeatureListItem>
              <FeatureListItem>Application assistance</FeatureListItem>
            </ul>
          </FeatureCard>

          <FeatureCard icon={<FaRobot size={24} />} title="AI Recommendations">
            <p>Smart AI that suggests accessible routes and facilities based on your needs.</p>
            <ul className="mt-2 text-sm">
              <FeatureListItem>Personalized suggestions</FeatureListItem>
              <FeatureListItem>Voice search</FeatureListItem>
              <FeatureListItem>Predictive routing</FeatureListItem>
            </ul>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default Features;
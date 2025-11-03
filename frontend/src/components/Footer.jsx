import React from 'react';
import { FaUniversalAccess, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGooglePlay, FaApple } from 'react-icons/fa';

const FooterLink = ({ href, children }) => (
  <li>
    <a href={href} className="text-text-secondary hover:text-accent transition-colors">
      {children}
    </a>
  </li>
);

const SocialIcon = ({ href, icon }) => (
  <a href={href} className="text-text-secondary hover:text-accent transition-colors">
    {icon}
  </a>
);

const AppStoreButton = ({ href, icon, store, title }) => (
  <button className="flex items-center gap-2 bg-text-primary text-white p-2 rounded-lg w-full text-left hover:bg-text-secondary/80">
    {icon}
    <div>
      <span className="text-xs block">{store}</span>
      <span className="font-bold text-sm">{title}</span>
    </div>
  </button>
);

const Footer = () => {
  return (
    <footer className="bg-background-secondary border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FaUniversalAccess className="text-accent text-2xl" />
              <span className="text-text-primary text-xl font-display font-bold">
                Smart Inclusion
              </span>
            </div>
            <p className="text-text-secondary mb-4">
              Your gateway to an accessible world. Empowering persons with disabilities through technology.
            </p>
            <div className="flex gap-4">
              <SocialIcon href="https://www.facebook.com/" icon={<FaFacebook size={20} />} />
              <SocialIcon href="https://x.com/" icon={<FaTwitter size={20} />} />
              <SocialIcon href="https://www.instagram.com/" icon={<FaInstagram size={20} />} />
              <SocialIcon href="https://www.linkedin.com/" icon={<FaLinkedin size={20} />} />
            </div>
          </div>

          <div>
            <h4 className="font-bold font-display text-text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink href="#home">Home</FooterLink>
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#map">Accessibility Map</FooterLink>
              <FooterLink href="#schemes">Government Schemes</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-bold font-display text-text-primary mb-4">Support</h4>
            <ul className="space-y-2">
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Contact Us</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-bold font-display text-text-primary mb-4">Download App</h4>
            <div className="space-y-3">
              <AppStoreButton href="#" icon={<FaGooglePlay size={24} />} store="Get it on" title="Google Play" />
              <AppStoreButton href="#" icon={<FaApple size={24} />} store="Download on the" title="App Store" />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-text-secondary text-sm">
          &copy; {new Date().getFullYear()} Smart Inclusion App. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
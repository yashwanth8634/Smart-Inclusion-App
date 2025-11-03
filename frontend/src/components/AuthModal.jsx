import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const AuthModal = ({ isOpen, onClose, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  const FormInput = ({ id, label, type = 'text', placeholder }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
      />
    </div>
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background-primary rounded-lg shadow-xl w-full max-w-md m-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
        >
          <FaTimes />
        </button>

        <div className="flex border-b border-border">
          <button
            className={`flex-1 py-3 font-semibold ${
              activeTab === 'login'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-secondary'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 font-semibold ${
              activeTab === 'register'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-secondary'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'login' && (
            <form>
              <h3 className="text-xl font-bold text-text-primary mb-1">Welcome Back</h3>
              <p className="text-text-secondary mb-6">Sign in to your account</p>
              <FormInput id="login-email" label="Email" type="email" placeholder="Enter your email" />
              <FormInput id="login-password" label="Password" type="password" placeholder="Enter your password" />
              <a href="#" className="text-sm text-accent hover:underline">
                Forgot password?
              </a>
              <button
                type="submit"
                className="w-full mt-6 py-2 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg"
              >
                Sign In
              </button>
            </form>
          )}

          {activeTab === 'register' && (
            <form>
              <h3 className="text-xl font-bold text-text-primary mb-1">Create Account</h3>
              <p className="text-text-secondary mb-6">Join the Smart Inclusion community</p>
              <FormInput id="reg-name" label="Full Name" placeholder="Enter your full name" />
              <FormInput id="reg-email" label="Email" type="email" placeholder="Enter your email" />
              <FormInput id="reg-phone" label="Phone Number" type="tel" placeholder="Enter your phone" />
              <FormInput id="reg-password" label="Password" type="password" placeholder="Create a password" />

              <div className="mb-4">
                <label htmlFor="disability-type" className="block text-sm font-medium text-text-secondary mb-1">
                  Disability Type (Optional)
                </label>
                <select
                  id="disability-type"
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
                >
                  <option value="">I am registering as a user</option>
                  <option value="mobility">Mobility Impairment</option>
                  <option value="visual">Visual Impairment</option>
                  <option value="hearing">Hearing Impairment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  id="is-volunteer"
                  type="checkbox"
                  className="h-4 w-4 text-accent bg-background-secondary border-border rounded focus:ring-accent"
                />
                <label htmlFor="is-volunteer" className="ml-2 block text-sm text-text-secondary">
                  I also want to register as a **Volunteer**
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full mt-6 py-2 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg"
              >
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
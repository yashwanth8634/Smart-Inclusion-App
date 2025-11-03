import React, { useState, useEffect, useContext } from 'react';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const FormInput = ({ id, label, type = 'text', placeholder, value, onChange, required = false }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
    />
  </div>
);

const AuthModal = ({ isOpen, onClose, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'login');
  const { login } = useContext(AuthContext);
  const [error, setError] = useState(null);

  const [regUserData, setRegUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    disabilityType: 'none',
  });

  const [regVolunteerData, setRegVolunteerData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    loginAs: 'user',
  });

  const handleRegUserInputChange = (e) => {
    const { id, value } = e.target;
    setRegUserData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleRegVolunteerInputChange = (e) => {
    const { id, value } = e.target;
    setRegVolunteerData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLoginInputChange = (e) => {
    const { id, value, name } = e.target;
    if (name === 'loginAs') {
      setLoginData((prev) => ({ ...prev, loginAs: value }));
    } else {
      setLoginData((prev) => ({ ...prev, [id]: value }));
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'login');
      setError(null);
    }
  }, [isOpen, initialTab]);

  const handleUserRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(
        'http://localhost:3000/api/auth/register/user', 
        regUserData
      );
      console.log(res.data);
      alert('Registration Successful! Please log in.');
      setActiveTab('login');
    } catch (error) {
      console.error('Registration failed:', error.response.data.message);
      setError(error.response.data.message);
    }
  };
  
  const handleVolunteerRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(
        'http://localhost:3000/api/auth/register/volunteer', 
        regVolunteerData
      );
      console.log(res.data);
      alert('Registration Successful! Please log in.');
      setActiveTab('login');
    } catch (error) {
      console.error('Registration failed:', error.response.data.message);
      setError(error.response.data.message);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(
        'http://localhost:3000/api/auth/login',
        loginData
      );
      login(res.data.token, res.data.user);
      onClose();
    } catch (error)
    {
      console.error('Login failed:', error.response.data.message);
      setError(error.response.data.message);
    }
  };

  const switchTab = (tab) => {
    setError(null);
    setActiveTab(tab);
  };

  if (!isOpen) return null;

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
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary z-10"
        >
          <FaTimes />
        </button>

        {activeTab.startsWith('register') && activeTab !== 'register' && (
          <button
            onClick={() => switchTab('register')}
            className="absolute top-4 left-4 text-text-secondary hover:text-text-primary z-10"
          >
            <FaArrowLeft />
          </button>
        )}

        <div className="flex border-b border-border">
          <button
            className={`flex-1 py-3 font-semibold ${
              activeTab === 'login'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-secondary'
            }`}
            onClick={() => switchTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 font-semibold ${
              activeTab.startsWith('register')
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-secondary'
            }`}
            onClick={() => switchTab('register')}
          >
            Register
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <h3 className="text-xl font-bold text-text-primary mb-1">Welcome Back</h3>
              <p className="text-text-secondary mb-6">Sign in to your account</p>
              
              <FormInput 
                id="email" 
                label="Email" 
                type="email" 
                placeholder="Enter your email"
                value={loginData.email}
                onChange={handleLoginInputChange}
                required={true}
              />
              <FormInput 
                id="password" 
                label="Password" 
                type="password" 
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleLoginInputChange}
                required={true}
              />
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-2">Login as:</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="loginAs"
                      value="user" 
                      checked={loginData.loginAs === 'user'} 
                      onChange={handleLoginInputChange}
                      className="h-4 w-4 text-accent border-border"
                    />
                    <span className="ml-2 text-text-primary">User</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="loginAs"
                      value="volunteer" 
                      checked={loginData.loginAs === 'volunteer'} 
                      onChange={handleLoginInputChange}
                      className="h-4 w-4 text-accent border-border"
                    />
                    <span className="ml-2 text-text-primary">Volunteer</span>
                  </label>
                </div>
              </div>

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
            <div className="text-center">
              <h3 className="text-xl font-bold text-text-primary mb-1">Join the Community</h3>
              <p className="text-text-secondary mb-6">How would you like to register?</p>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => switchTab('registerUser')}
                  className="w-full py-3 text-lg bg-accent text-white font-bold rounded-lg"
                >
                  Register as a User
                </button>
                <button
                  onClick={() => switchTab('registerVolunteer')}
                  className="w-full py-3 text-lg text-accent border-2 border-accent rounded-lg"
                >
                  Register as a Volunteer
                </button>
              </div>
            </div>
          )}

          {activeTab === 'registerUser' && (
            <form onSubmit={handleUserRegisterSubmit}>
              <h3 className="text-xl font-bold text-text-primary mb-1">Create User Account</h3>
              <p className="text-text-secondary mb-6">Join the Smart Inclusion community</p>
              
              <FormInput 
                id="fullName" 
                label="Full Name" 
                placeholder="Enter your full name"
                value={regUserData.fullName}
                onChange={handleRegUserInputChange} 
                required={true}
              />
              <FormInput 
                id="email" 
                label="Email" 
                type="email" 
                placeholder="Enter your email"
                value={regUserData.email}
                onChange={handleRegUserInputChange} 
                required={true}
              />
              <FormInput 
                id="phone" 
                label="Phone Number" 
                type="tel" 
                placeholder="Enter your phone"
                value={regUserData.phone}
                onChange={handleRegUserInputChange} 
                required={true}
              />
              <FormInput 
                id="password" 
                label="Password" 
                type="password" 
                placeholder="Create a password"
                value={regUserData.password}
                onChange={handleRegUserInputChange} 
                required={true}
              />

              <div className="mb-4">
                <label htmlFor="disabilityType" className="block text-sm font-medium text-text-secondary mb-1">
                  Disability Type (Optional)
                </label>
                <select
                  id="disabilityType"
                  value={regUserData.disabilityType}
                  onChange={handleRegUserInputChange}
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
                >
                  <option value="none">I am registering as a user</option>
                  <option value="mobility">Mobility Impairment</option>
                  <option value="visual">Visual Impairment</option>
                  <option value="hearing">Hearing Impairment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full mt-6 py-2 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg"
              >
                Create Account
              </button>
            </form>
          )}

          {activeTab === 'registerVolunteer' && (
            <form onSubmit={handleVolunteerRegisterSubmit}>
              <h3 className="text-xl font-bold text-text-primary mb-1">Create Volunteer Account</h3>
              <p className="text-text-secondary mb-6">Help us build an accessible world</p>
              
              <FormInput 
                id="fullName" 
                label="Full Name" 
                placeholder="Enter your full name"
                value={regVolunteerData.fullName}
                onChange={handleRegVolunteerInputChange} 
                required={true}
              />
              <FormInput 
                id="email" 
                label="Email" 
                type="email" 
                placeholder="Enter your email"
                value={regVolunteerData.email}
                onChange={handleRegVolunteerInputChange} 
                required={true}
              />
              <FormInput 
                id="phone" 
                label="Phone Number" 
                type="tel" 
                placeholder="Enter your phone"
                value={regVolunteerData.phone}
                onChange={handleRegVolunteerInputChange} 
                required={true}
              />
              <FormInput 
                id="password" 
                label="Password" 
                type="password" 
                placeholder="Create a password"
                value={regVolunteerData.password}
                onChange={handleRegVolunteerInputChange} 
                required={true}
              />
              
              <button
                type="submit"
                className="w-full mt-6 py-2 bg-accent hover:bg-accent-hover text-white font-bold rounded-lg"
              >
                Create Volunteer Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
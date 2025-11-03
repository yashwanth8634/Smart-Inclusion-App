import React, { useState, useContext } from 'react';
import { FaUniversalAccess, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth, logout } = useContext(AuthContext);

  const NavLink = ({ href, children }) => (
    <Link to={href} className="text-text-secondary hover:text-accent transition-colors">
      {children}
    </Link>
  );
  
  const AnchorLink = ({ href, children }) => (
    <a href={href} className="text-text-secondary hover:text-accent transition-colors">
      {children}
    </a>
  );

  const MapLink = () => {
    if (auth) {
      return <Link to="/app" className="text-text-secondary hover:text-accent transition-colors">Map</Link>;
    }
    return (
      <button onClick={onLoginClick} className="text-text-secondary hover:text-accent transition-colors">
        Map
      </button>
    );
  };

  const MobileMapLink = ({ closeMenu }) => {
    if (auth) {
      return <Link to="/app" onClick={closeMenu} className="text-2xl text-text-primary hover:text-accent">Map</Link>;
    }
    return (
      <button 
        onClick={() => {
          onLoginClick();
          closeMenu();
        }} 
        className="text-2xl text-text-primary hover:text-accent"
      >
        Map
      </button>
    );
  };

  return (
    <>
      <nav className="w-full bg-background-primary/80 backdrop-blur-sm p-4 md:px-8 flex justify-between items-center fixed top-0 left-0 z-40 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <FaUniversalAccess className="text-accent text-2xl" />
          <span className="text-text-primary text-xl font-display font-bold">
            Smart Inclusion
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/schemes">Schemes</NavLink>
          <AnchorLink href="/#about">About</AnchorLink>
          <MapLink />
        </div>

        <div className="hidden md:flex items-center gap-4">
          {auth ? (
            <>
              <span className="text-text-secondary">
                Welcome, <span className="font-bold text-text-primary">{auth.user.fullName}</span>
              </span>
              <button 
                onClick={logout} 
                className="bg-accent/10 hover:bg-accent/20 text-accent font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={onLoginClick} className="text-text-secondary hover:text-text-primary transition-colors">
                Login
              </button>
              <button onClick={() => onRegisterClick('register')} className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-all">
                Register
              </button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(true)}>
            <FaBars className="text-text-primary text-2xl" />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-background-primary z-50 flex flex-col items-center justify-center gap-8 transition-transform transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-6 right-6"
        >
          <FaTimes className="text-text-primary text-3xl" />
        </button>

        <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl text-text-primary hover:text-accent">Home</Link>
        <Link to="/schemes" onClick={() => setIsMenuOpen(false)} className="text-2xl text-text-primary hover:text-accent">Schemes</Link>
        <a href="/#about" onClick={() => setIsMenuOpen(false)} className="text-2xl text-text-primary hover:text-accent">About</a>
        <MobileMapLink closeMenu={() => setIsMenuOpen(false)} />
        
        <div className="flex flex-col gap-6 w-full px-8 mt-8">
          {auth ? (
            <>
              <span className="text-text-secondary text-center">
                Welcome, <span className="font-bold text-text-primary">{auth.user.fullName}</span>
              </span>
              <button 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }} 
                className="w-full py-3 text-lg text-accent border-2 border-accent rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { onLoginClick(); setIsMenuOpen(false); }} className="w-full py-3 text-lg text-accent border-2 border-accent rounded-lg">
                Login
              </button>
              <button onClick={() => { onRegisterClick('register'); setIsMenuOpen(false); }} className="w-full py-3 text-lg bg-accent text-white font-bold rounded-lg">
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
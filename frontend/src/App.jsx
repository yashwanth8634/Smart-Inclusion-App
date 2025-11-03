import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import MainApp from './pages/MainApp';


function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      <Route 
        path="/" 
        element={!auth ? <LandingPage /> : <Navigate to="/app" />} 
      />
      <Route 
        path="/app" 
        element={auth ? <MainApp /> : <Navigate to="/" />} 
      />
    </Routes>
  );
}

export default App;
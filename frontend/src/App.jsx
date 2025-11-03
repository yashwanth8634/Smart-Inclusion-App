import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import MainApp from './pages/MainApp';
import SchemesPage from './pages/SchemesPage';


function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      <Route 
        path="/" 
        element={!auth ? <LandingPage /> : <Navigate to="/app" />} 
      />
      
      <Route path="/schemes" element={<SchemesPage />} />

      <Route 
        path="/app" 
        element={auth ? <MainApp /> : <Navigate to="/" />} 
      />
    </Routes>
  );
}

export default App;
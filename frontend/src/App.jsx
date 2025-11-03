import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* We will add these routes next:
        <Route path="/login/user" element={<UserLoginPage />} />
        <Route path="/register/user" element={<UserRegisterPage />} />
        <Route path="/login/volunteer" element={<VolunteerLoginPage />} />
        <Route path="/register/volunteer" element={<VolunteerRegisterPage />} />
      */}
    </Routes>
  );
}

export default App;
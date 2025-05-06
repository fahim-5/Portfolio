import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Component Imports
import AdminLogin from './components/AdminLogin';
import PortfolioHome from './pages/protfolio/PortfolioHome'; 

// Global Styles
import './styles/globals.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
};

export default App;

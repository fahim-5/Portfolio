import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Component Imports
import AdminLogin from "./components/AdminLogin";
import AdminNavbar from "./pages/admin/AdminNavbar";
// import PortfolioHome from './pages/protfolio/PortfolioHome';

// Global Styles
import "./styles/globals.css";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<PortfolioHome />} /> */}
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminNavbar />} />
      </Routes>
    </Router>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Component Imports
import AdminLogin from "./components/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import HeroAdmin from "./pages/admin/HeroAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
// import PortfolioHome from './pages/protfolio/PortfolioHome';

// Global Styles
import "./styles/globals.css";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<PortfolioHome />} /> */}
        <Route path="/" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            
              <Dashboard />
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hero"
          element={
            
              <HeroAdmin />
           
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

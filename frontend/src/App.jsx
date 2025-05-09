import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Component Imports
import AdminLogin from "./components/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import HeroAdmin from "./pages/admin/HeroAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminNavbar from "./pages/admin/AdminNavbar";
import AdminSkillsManager from "./pages/admin/AdminSkillsManager";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminPictures from "./pages/admin/AdminPictures";
import AdminExperience from "./pages/admin/AdminExperience";
import AdminEducation from "./pages/admin/AdminEducation";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminReferences from "./pages/admin/AdminReferences";

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

        <Route
          path="/admin/hero"
          element={
            
              <AdminAbout />
           
          }
        />
        <Route
          path="/admin/hero"
          element={
            
              <AdminEducation />
           
          }
        />

        <Route
          path="/admin/hero"
          element={
            
              <AdminPictures />
           
          }
        />

        <Route
          path="/admin/hero"
          element={
            
              <AdminPortfolio />
           
          }
        />

        
      </Routes>
    </Router>
  );
};

export default App;

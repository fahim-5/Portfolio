import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import portfolioService from "./services/portfolioService";

// Component Imports
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import HeroAdmin from "./pages/admin/HeroAdmin";
import AdminNavbar from "./pages/admin/AdminNavbar";
import AdminSkillsManager from "./pages/admin/AdminSkillsManager";

import AdminPictures from "./pages/admin/AdminPictures";
import AdminExperience from "./pages/admin/AdminExperience";
import AdminEducation from "./pages/admin/AdminEducation";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminReferences from "./pages/admin/AdminReferences";
import ProtectedRoute from "./components/ProtectedRoute";

import PortfolioHome from "./pages/PortfolioHome";

// Global Styles
import "./styles/globals.css";

const App = () => {
  // Clear localStorage on app startup to ensure we only use database data
  useEffect(() => {
    console.log("App mounted - clearing localStorage to use only database data");
    portfolioService.clearLocalStorage();
  }, []);

  return (
    <Router>
      <Routes>

        <Route path="/" element={<PortfolioHome />} />
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminNavbar />
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="settings" element={<Settings />} />
                <Route path="hero" element={<HeroAdmin />} />
                <Route path="education" element={<AdminEducation />} />
                <Route path="experience" element={<AdminExperience />} />
                <Route path="skills" element={<AdminSkillsManager />} />
                <Route path="pictures" element={<AdminPictures />} />
                <Route path="projects" element={<AdminPortfolio />} />
                <Route path="references" element={<AdminReferences />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

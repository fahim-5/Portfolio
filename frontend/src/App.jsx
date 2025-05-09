import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Component Imports
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import HeroAdmin from "./pages/admin/HeroAdmin";
import AdminNavbar from "./pages/admin/AdminNavbar";
import AdminSkillsManager from "./pages/admin/AdminSkillsManager";
import AdminAbout from "./pages/admin/AdminAbout";

import AdminPictures from "./pages/admin/AdminPictures";
import AdminExperience from "./pages/admin/AdminExperience";
import AdminEducation from "./pages/admin/AdminEducation";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminReferences from "./pages/admin/AdminReferences";
import ProtectedRoute from "./components/ProtectedRoute";

// Global Styles
import "./styles/globals.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
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
                <Route path="about" element={<AdminAbout />} />
                <Route path="education" element={<AdminEducation />} />
                <Route path="experience" element={<AdminExperience />} />
                <Route path="skills" element={<AdminSkillsManager />} />
                <Route path="pictures" element={<AdminPictures />} />
                <Route path="portfolio" element={<AdminPortfolio />} />
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

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './adminDashboard.css';

// Import services
import portfolioService from '../../services/portfolioService';

// Import components
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import { Notification } from '../../components/DataRecovery';

// Import editor components directly
import PersonalInfoEditor from './PersonalInfoEditor';
import EducationEditor from './EducationEditor';
import ExperienceEditor from './ExperienceEditor';
import SkillsEditor from './SkillsEditor';
import PictureEditors from './PictureEditors';
import ProjectEditors from './ProjectEditors';
import HighlightsEditors from './HighrlightsEditors';
import ReferenceEditor from './Reference';
import Settings from './Settings';

// Placeholder editor component for sections under construction
const PlaceholderEditor = ({ title }) => {
  return (
    <div className="editorContainer">
      <div className="editorHeader">
        <h2>{title || 'Editor'}</h2>
      </div>
      
      <div className="placeholderContent">
        <div className="placeholderIcon">🚧</div>
        <h3>{title} Editor</h3>
        <p>This section is currently under construction.</p>
        <p>We're working hard to bring you a great editing experience soon!</p>
      </div>
    </div>
  );
};

// Dashboard Home component
const DashboardHome = ({ portfolioData, recentActivity, formatRelativeDate, changeSection }) => {
  return (
    <div id="dashboardHome" className="content-section">
      <div className="welcome-stats">
        <div className="welcome-message">
          <h1>Welcome back, Fahim!</h1>
          <p>Here's a summary of your portfolio stats</p>
        </div>
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <div className="stat-info">
              <h3>{portfolioData.projectsCount || 3}</h3>
              <p>Projects</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div className="stat-info">
              <h3>{portfolioData.educationCount || 3}</h3>
              <p>Education</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-laptop-code"></i>
            </div>
            <div className="stat-info">
              <h3>{portfolioData.skillsCount || 18}</h3>
              <p>Skills</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-eye"></i>
            </div>
            <div className="stat-info">
              <h3>{portfolioData.portfolioViews || 384}</h3>
              <p>Portfolio Views</p>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => changeSection('projects')}>
            <i className="fas fa-plus"></i> Add Project
          </button>
          <button className="action-btn" onClick={() => changeSection('skills')}>
            <i className="fas fa-plus"></i> Add Skill
          </button>
          <button className="action-btn" onClick={() => changeSection('education')}>
            <i className="fas fa-plus"></i> Add Education
          </button>
          <button className="action-btn" onClick={() => changeSection('pictures')}>
            <i className="fas fa-plus"></i> Upload Image
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-timeline">
          {recentActivity.length > 0 ? (
            recentActivity.slice(0, 3).map((activity, index) => (
              <div className="activity-item" key={index}>
                <div className="activity-icon">
                  {activity.type === 'edit' && <i className="fas fa-edit"></i>}
                  {activity.type === 'add' && <i className="fas fa-plus"></i>}
                  {activity.type === 'delete' && <i className="fas fa-trash"></i>}
                </div>
                <div className="activity-details">
                  <p>You updated your Personal Information</p>
                  <span className="activity-time">{formatRelativeDate(activity.timestamp)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-activity">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  // Get username from URL params
  const { username } = useParams();
  
  // Initialize portfolio data on component mount
  useEffect(() => {
    console.log('Initializing storage in AdminDashboard');
    try {
      portfolioService.initializeStorage();
    } catch (error) {
      console.error('Error initializing portfolio storage:', error);
      showNotification('Error initializing data. Please try refreshing the page.', 'error');
    }
  }, []);

  // State for sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // State for active section
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // State for user dropdown
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // State for notification message
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // State for recent activity
  const [recentActivity, setRecentActivity] = useState([]);
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // State for portfolio data
  const [portfolioData, setPortfolioData] = useState({
    name: 'Fahim Faysal',
    title: 'Web Developer',
    projectsCount: 3,
    educationCount: 3,
    skillsCount: 18,
    portfolioViews: 384
  });

  // State for personal info data
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    jobTitle: '',
    introText: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      instagram: ''
    },
    hero: {
      greeting: "Hello, I'm",
      description: "",
      stats: [
        { value: "5+", label: "Years Experience" },
        { value: "100+", label: "Projects Completed" },
        { value: "50+", label: "Happy Clients" }
      ],
      buttonText: "Get In Touch",
      profileImageUrl: null
    },
    aboutImageUrl: null
  });

  // State for education entries
  const [educationEntries, setEducationEntries] = useState([]);
  
  // State for experience entries
  const [experienceEntries, setExperienceEntries] = useState([]);
  
  // State for skills data
  const [skillsData, setSkillsData] = useState({
    technical: [],
    soft: [],
    languages: []
  });

  // State for pictures
  const [pictures, setPictures] = useState([]);
  
  // State for projects
  const [projects, setProjects] = useState([]);
  
  // State for highlights
  const [highlights, setHighlights] = useState([]);
  
  // State for references
  const [references, setReferences] = useState([]);
  
  // State for delete education confirmation
  const [showDeleteEducationConfirm, setShowDeleteEducationConfirm] = useState(false);
  const [deleteEducationIndex, setDeleteEducationIndex] = useState(null);

  // Load data on mount
  useEffect(() => {
    try {
      // Load personal info
      const storedPersonalInfo = portfolioService.getSectionData('personalInfo');
      if (storedPersonalInfo) {
        setPersonalInfo(storedPersonalInfo);
      }
      
      // Load education entries
      const storedEducation = portfolioService.getSectionData('education');
      if (storedEducation) {
        setEducationEntries(storedEducation);
      }
      
      // Load experience entries
      const storedExperience = portfolioService.getSectionData('experience');
      if (storedExperience) {
        setExperienceEntries(storedExperience);
      }
      
      // Load skills data
      const storedSkills = portfolioService.getSectionData('skills');
      if (storedSkills) {
        setSkillsData(storedSkills);
      }
      
      // Load pictures
      const storedPictures = portfolioService.getSectionData('pictures');
      if (storedPictures) {
        setPictures(storedPictures);
      }
      
      // Load projects
      const storedProjects = portfolioService.getSectionData('projects');
      if (storedProjects) {
        setProjects(storedProjects);
      }
      
      // Load highlights
      const storedHighlights = portfolioService.getSectionData('highlights');
      if (storedHighlights) {
        setHighlights(storedHighlights);
      }
      
      // Load references
      const storedReferences = portfolioService.getSectionData('references');
      if (storedReferences) {
        setReferences(storedReferences);
      }
      
      // Update portfolio data for dashboard
      setPortfolioData({
        name: storedPersonalInfo?.name || 'Fahim Faysal',
        title: storedPersonalInfo?.jobTitle || 'Web Developer',
        projectsCount: 0, // Will be updated separately
        educationCount: storedEducation?.length || 0,
        skillsCount: 
          (storedSkills?.technical?.length || 0) + 
          (storedSkills?.soft?.length || 0) + 
          (storedSkills?.languages?.length || 0),
        portfolioViews: portfolioService.getPortfolioViews?.() || 0
      });
      
      // Setup listener for data changes
      const handleDataChange = (event) => {
        const { section } = event.detail || {};
        console.log(`Data changed in section: ${section}`);
        
        if (!section || section === 'personalInfo') {
          const personalInfoData = portfolioService.getSectionData('personalInfo');
          if (personalInfoData) {
            setPersonalInfo(personalInfoData);
          }
        } else if (section === 'education') {
          const educationData = portfolioService.getSectionData('education');
          if (educationData) {
            setEducationEntries(educationData);
          }
        } else if (section === 'experience') {
          const experienceData = portfolioService.getSectionData('experience');
          if (experienceData) {
            setExperienceEntries(experienceData);
          }
        } else if (section === 'skills') {
          const skillsData = portfolioService.getSectionData('skills');
          if (skillsData) {
            setSkillsData(skillsData);
          }
        } else if (section === 'pictures') {
          const picturesData = portfolioService.getSectionData('pictures');
          if (picturesData) {
            setPictures(picturesData);
          }
        } else if (section === 'projects') {
          const projectsData = portfolioService.getSectionData('projects');
          if (projectsData) {
            setProjects(projectsData);
          }
        } else if (section === 'highlights') {
          const highlightsData = portfolioService.getSectionData('highlights');
          if (highlightsData) {
            setHighlights(highlightsData);
          }
        } else if (section === 'references') {
          const referencesData = portfolioService.getSectionData('references');
          if (referencesData) {
            setReferences(referencesData);
          }
        }
      };
      
      // Add event listener
      window.addEventListener('portfolio-data-changed', handleDataChange);
      
      // Log that data was loaded
      console.log('Portfolio data loaded successfully');
      
      // Cleanup function
      return () => {
        window.removeEventListener('portfolio-data-changed', handleDataChange);
      };
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('Error loading data. Please refresh the page.', 'error');
    }
  }, []);

  // Function to show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Function to change active section
  const changeSection = (section) => {
    console.log(`Changing section to: ${section}`);
    
    // Consistency check for section naming
    if (section === 'personal') {
      section = 'personalInfo';
      console.log('Converting "personal" to "personalInfo" for consistency');
    }
    
    setActiveSection(section);
    
    // Load section-specific data
    try {
      if (section === 'personalInfo') {
        console.log('Loading personal info data');
        const personalData = portfolioService.getSectionData('personalInfo');
        console.log('Personal data from service:', personalData);
        
        // Make sure we have data
        if (personalData) {
          console.log('Setting personal info state with data');
          setPersonalInfo(personalData);
        } else {
          console.warn('No personal info data returned from service');
        }
      } else if (section === 'education') {
        console.log('Loading education data');
        const educationData = portfolioService.getSectionData('education');
        console.log('Education data from service:', educationData);
        if (educationData) {
          setEducationEntries(educationData);
        }
      } else if (section === 'experience') {
        const experienceData = portfolioService.getSectionData('experience');
        if (experienceData) {
          setExperienceEntries(experienceData);
        }
      } else if (section === 'skills') {
        const skillsData = portfolioService.getSectionData('skills');
        if (skillsData) {
          setSkillsData(skillsData);
        }
      } else if (section === 'pictures') {
        const picturesData = portfolioService.getSectionData('pictures');
        if (picturesData) {
          setPictures(picturesData);
        }
      } else if (section === 'projects') {
        const projectsData = portfolioService.getSectionData('projects');
        if (projectsData) {
          setProjects(projectsData);
        }
      } else if (section === 'highlights') {
        const highlightsData = portfolioService.getSectionData('highlights');
        if (highlightsData) {
          setHighlights(highlightsData);
        }
      } else if (section === 'references') {
        const referencesData = portfolioService.getSectionData('references');
        if (referencesData) {
          setReferences(referencesData);
        }
      }
    } catch (error) {
      console.error('Error loading section data:', error);
    }
  };

  // Function to toggle user dropdown
  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest(`.${styles['user-profile']}`)) {
        setUserDropdownOpen(false);
      }
      
      // Close search results if clicking outside
      if (showSearchResults && !event.target.closest(`.${styles['search-container']}`)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen, showSearchResults]);

  // Handle logout
  const handleLogout = () => {
    // In a real app, you would handle proper logout
    window.location.href = '/admin/login';
  };

  // Personal Info Section Functions
  const updatePersonalInfo = (field, value) => {
    setPersonalInfo(prevInfo => {
      if (field.includes('.')) {
        // Handle nested fields like socialLinks.linkedin or hero.greeting
        const parts = field.split('.');
        if (parts.length === 2) {
          const [parent, child] = parts;
          return {
            ...prevInfo,
            [parent]: {
              ...(prevInfo[parent] || {}),
              [child]: value
            }
          };
        }
      }
      return { ...prevInfo, [field]: value };
    });
  };

  const savePersonalInfoChanges = () => {
    // Save to service with the correct section name
    portfolioService.saveSectionData('personalInfo', personalInfo);
    
    // Log activity
    logActivity('edit', 'Personal Information');
    
    showNotification('Personal information saved successfully!');
    setPortfolioData(prev => ({
      ...prev,
      name: personalInfo.name,
      title: personalInfo.jobTitle
    }));
  };

  // Education Section Functions
  const addEducationEntry = () => {
    const newEducation = {
      degree: 'New Degree',
      field: 'Field of Study',
      institution: 'Institution Name',
      location: 'Location',
      startDate: '',
      endDate: '',
      current: false,
      description: 'Enter your description here'
    };
    
    const updatedEntries = [...educationEntries, newEducation];
    setEducationEntries(updatedEntries);
    
    // Log activity
    logActivity('add', 'Education', 'New Degree');
  };

  const updateEducationEntry = (index, field, value) => {
    const updatedEntries = [...educationEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setEducationEntries(updatedEntries);
  };

  const confirmDeleteEducation = (index) => {
    setDeleteEducationIndex(index);
    setShowDeleteEducationConfirm(true);
  };

  const deleteEducationEntry = () => {
    if (deleteEducationIndex !== null) {
      const deletedEntry = educationEntries[deleteEducationIndex];
      const updatedEntries = educationEntries.filter((_, i) => i !== deleteEducationIndex);
      setEducationEntries(updatedEntries);
      setShowDeleteEducationConfirm(false);
      setDeleteEducationIndex(null);
      
      // Log activity
      logActivity('delete', 'Education', deletedEntry.degree || 'Education Entry');
      
      showNotification('Education entry deleted successfully!');
    }
  };

  const cancelDeleteEducation = () => {
    setShowDeleteEducationConfirm(false);
    setDeleteEducationIndex(null);
  };

  const saveEducationChanges = () => {
    portfolioService.saveSectionData('education', educationEntries);
    logActivity('edit', 'Education');
    showNotification('Education saved successfully!');
    
    // Update portfolio stats
    setPortfolioData(prev => ({
      ...prev,
      educationCount: educationEntries.length
    }));
  };

  // Experience Section Functions
  const addExperienceEntry = () => {
    const newExperience = {
      position: 'New Position',
      company: 'Company Name',
      location: 'Location',
      period: 'Period',
      description: 'Enter your description here'
    };
    
    const updatedEntries = [...experienceEntries, newExperience];
    setExperienceEntries(updatedEntries);
    
    // Log activity
    logActivity('add', 'Experience', 'New Position');
    showNotification('New experience entry added');
  };

  const updateExperienceEntry = (index, field, value) => {
    const updatedEntries = [...experienceEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setExperienceEntries(updatedEntries);
  };

  const deleteExperienceEntry = (index) => {
    const deletedEntry = experienceEntries[index];
    const updatedEntries = experienceEntries.filter((_, i) => i !== index);
    setExperienceEntries(updatedEntries);
    
    // Log activity
    logActivity('delete', 'Experience', deletedEntry.position || 'Experience Entry');
    showNotification('Experience entry deleted');
  };

  const saveExperienceChanges = () => {
    portfolioService.saveSectionData('experience', experienceEntries);
    logActivity('edit', 'Experience');
    showNotification('Experience saved successfully!');
  };

  // Skills Section Functions
  const addSkill = (type, name = '', level = 'intermediate') => {
    setSkillsData(prev => {
      const updated = { ...prev };
      
      if (type === 'technical') {
        updated.technical = [...prev.technical, { name, level }];
        // Log activity
        logActivity('add', 'Skills', name || 'Technical Skill');
      } else if (type === 'soft') {
        updated.soft = [...prev.soft, { name }];
        // Log activity
        logActivity('add', 'Skills', name || 'Soft Skill');
      } else if (type === 'languages') {
        updated.languages = [...prev.languages, { name, level }];
        // Log activity
        logActivity('add', 'Skills', name || 'Language Skill');
      }
      
      return updated;
    });
    showNotification('New skill added');
  };

  const updateSkill = (type, index, field, value) => {
    setSkillsData(prev => {
      const updated = { ...prev };
      
      if (type === 'technical') {
        updated.technical = [...prev.technical];
        updated.technical[index] = { 
          ...updated.technical[index], 
          [field]: value 
        };
      } else if (type === 'soft') {
        updated.soft = [...prev.soft];
        updated.soft[index] = { 
          ...updated.soft[index], 
          [field]: value 
        };
      } else if (type === 'languages') {
        updated.languages = [...prev.languages];
        updated.languages[index] = { 
          ...updated.languages[index], 
          [field]: value 
        };
      }
      
      return updated;
    });
  };

  const deleteSkill = (type, index) => {
    setSkillsData(prev => {
      const updated = { ...prev };
      let skillName = '';
      
      if (type === 'technical') {
        skillName = prev.technical[index]?.name || 'Technical Skill';
        updated.technical = prev.technical.filter((_, i) => i !== index);
      } else if (type === 'soft') {
        skillName = prev.soft[index]?.name || 'Soft Skill';
        updated.soft = prev.soft.filter((_, i) => i !== index);
      } else if (type === 'languages') {
        skillName = prev.languages[index]?.name || 'Language Skill';
        updated.languages = prev.languages.filter((_, i) => i !== index);
      }
      
      // Log activity
      logActivity('delete', 'Skills', skillName);
      
      return updated;
    });
    showNotification('Skill deleted');
  };

  // Function to log activity
  const logActivity = (type, section, name = null) => {
    const newActivity = {
      type,
      section,
      name,
      timestamp: new Date().toISOString()
    };
    const updatedActivity = [newActivity, ...recentActivity.slice(0, 9)]; // Keep only the 10 most recent activities
    setRecentActivity(updatedActivity);
    localStorage.setItem('portfolio_recent_activity', JSON.stringify(updatedActivity));
  };

  // Format relative date
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return `${diffDays} days ago, ` + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Handle search function
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setShowSearchResults(false);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const results = [];
    
    // Search in projects
    pictures.forEach(project => {
      if (project.title?.toLowerCase().includes(lowerQuery) || 
          project.description?.toLowerCase().includes(lowerQuery) ||
          project.category?.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'project',
          title: project.title,
          subtitle: project.category,
          section: 'pictures'
        });
      }
    });
    
    // Search in education
    educationEntries.forEach(education => {
      if (education.degree?.toLowerCase().includes(lowerQuery) || 
          education.institution?.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'education',
          title: education.degree,
          subtitle: education.institution,
          section: 'education'
        });
      }
    });
    
    // Search in experience
    experienceEntries.forEach(experience => {
      if (experience.position?.toLowerCase().includes(lowerQuery) || 
          experience.company?.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'experience',
          title: experience.position,
          subtitle: experience.company,
          section: 'experience'
        });
      }
    });
    
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  // Listen for hash changes to navigate to different sections
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && sections.includes(hash)) {
        setActiveSection(hash);
      }
    };

    // Define available sections
    const sections = ['dashboard', 'personalInfo', 'education', 'experience', 
                     'skills', 'highlights', 'projects', 'pictures', 
                     'references', 'settings'];
    
    // Check hash on mount
    handleHashChange();
    
    // Add event listener
    window.addEventListener('hashchange', handleHashChange);
    
    // Clean up
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Function to render the active section component
  const renderActiveSection = () => {
    switch(activeSection) {
      case 'dashboard':
        return (
          <DashboardHome
            portfolioData={portfolioData}
            recentActivity={recentActivity}
            formatRelativeDate={formatRelativeDate}
            changeSection={changeSection}
          />
        );
      case 'personalInfo':
        return (
          <div className="content-section">
            <PersonalInfoEditor
              personalInfo={personalInfo}
              updatePersonalInfo={updatePersonalInfo}
              savePersonalInfoChanges={savePersonalInfoChanges}
              changeSection={changeSection}
              showNotification={showNotification}
            />
          </div>
        );
      case 'education':
        return (
          <div className="content-section">
            <EducationEditor
              educationEntries={educationEntries}
              addEducationEntry={addEducationEntry}
              updateEducationEntry={updateEducationEntry}
              confirmDeleteEducation={confirmDeleteEducation}
              deleteEducationEntry={deleteEducationEntry}
              cancelDeleteEducation={cancelDeleteEducation}
              saveEducationChanges={saveEducationChanges}
              showDeleteEducationConfirm={showDeleteEducationConfirm}
              deleteEducationIndex={deleteEducationIndex}
              changeSection={changeSection}
            />
          </div>
        );
      case 'experience':
        return (
          <div className="content-section">
            <ExperienceEditor
              experienceEntries={experienceEntries}
              addExperienceEntry={addExperienceEntry}
              updateExperienceEntry={updateExperienceEntry}
              deleteExperienceEntry={deleteExperienceEntry}
              saveExperienceChanges={saveExperienceChanges}
            />
          </div>
        );
      case 'skills':
        return (
          <div className="content-section">
            <SkillsEditor
              skillsData={skillsData}
              addSkill={addSkill}
              updateSkill={updateSkill}
              deleteSkill={deleteSkill}
            />
          </div>
        );
      case 'highlights':
        return (
          <div className="content-section">
            <HighlightsEditors 
              highlights={highlights} 
              onSave={(data) => {
                portfolioService.saveSectionData('highlights', data);
                setHighlights(data);
                // Don't show notification on auto-save
              }} 
            />
          </div>
        );
      case 'pictures':
        return (
          <div className="content-section">
            <PictureEditors 
              pictures={pictures} 
              onSave={(data) => {
                portfolioService.saveSectionData('pictures', data);
                setPictures(data);
                // Don't show notification on auto-save
              }} 
            />
          </div>
        );
      case 'projects':
        return (
          <div className="content-section">
            <ProjectEditors 
              projects={projects} 
              onSave={(data) => {
                portfolioService.saveSectionData('projects', data);
                setProjects(data);
                // Don't show notification on auto-save
              }} 
            />
          </div>
        );
      case 'references':
        return (
          <div className="content-section">
            <ReferenceEditor 
              references={references} 
              onSave={(data) => {
                portfolioService.saveSectionData('references', data);
                setReferences(data);
                // Don't show notification on auto-save
              }} 
            />
          </div>
        );
      case 'settings':
        return (
          <Settings />
        );
      default:
        return (
          <DashboardHome
            portfolioData={portfolioData}
            recentActivity={recentActivity}
            formatRelativeDate={formatRelativeDate}
            changeSection={changeSection}
          />
        );
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar 
        sidebarCollapsed={sidebarCollapsed}
        activeSection={activeSection}
        changeSection={changeSection}
        portfolioData={portfolioData}
      />
      
      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <DashboardHeader 
          toggleSidebar={toggleSidebar}
          changeSection={changeSection}
        />
        
        <div className="dashboard-content">
          {renderActiveSection()}
          
          {notification.show && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification({ ...notification, show: false })}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState } from 'react';
import './adminDashboard.css';
import portfolioService from '../../services/portfolioService';

const SkillsEditor = ({ 
  skillsData, 
  addSkill, 
  updateSkill, 
  deleteSkill,
  saveExperienceChanges,
  changeSection
}) => {
  const [newTechnicalName, setNewTechnicalName] = useState('');
  const [newTechnicalLevel, setNewTechnicalLevel] = useState('intermediate');
  
  const [newSoftName, setNewSoftName] = useState('');
  
  const [newLanguageName, setNewLanguageName] = useState('');
  const [newLanguageLevel, setNewLanguageLevel] = useState('intermediate');
  
  const handleAddTechnicalSkill = () => {
    if (newTechnicalName.trim()) {
      addSkill('technical', newTechnicalName.trim(), newTechnicalLevel);
      setNewTechnicalName('');
    }
  };
  
  const handleAddSoftSkill = () => {
    if (newSoftName.trim()) {
      addSkill('soft', newSoftName.trim());
      setNewSoftName('');
    }
  };
  
  const handleAddLanguage = () => {
    if (newLanguageName.trim()) {
      addSkill('languages', newLanguageName.trim(), newLanguageLevel);
      setNewLanguageName('');
    }
  };
  
  const saveSkillsChanges = () => {
    portfolioService.saveSectionData('skills', skillsData);
  };
  
  return (
    <div className="content-section">
      <div className="editor-header">
        <h2>Edit Skills</h2>
        <div className="editor-actions">
          <button 
            className="btn-primary"
            onClick={saveSkillsChanges}
          >
            Save Changes
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => changeSection('dashboard')}
          >
            Cancel
          </button>
        </div>
      </div>
      
      <div className="skills-section">
        <h3 className="section-subheader">Technical Skills</h3>
        
        <div className="skills-list">
          {skillsData?.technical?.length > 0 ? (
            skillsData.technical.map((skill, index) => (
              <div key={index} className="skill-card">
                <div className="skill-header">
                  <h4 className="skill-title">Skill #{index + 1}</h4>
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => deleteSkill('technical', index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                <div className="skill-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Skill Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. C" 
                        value={skill.name || ''}
                        onChange={(e) => updateSkill('technical', index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Proficiency Level</label>
                      <select 
                        className="form-control" 
                        value={skill.level || 'intermediate'}
                        onChange={(e) => updateSkill('technical', index, 'level', e.target.value)}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="elementary">Elementary</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <i className="fas fa-laptop-code"></i>
              <p>No technical skills added yet.</p>
            </div>
          )}
        </div>
        
        <div className="section-footer">
          <button 
            className="btn-add-skill" 
            onClick={handleAddTechnicalSkill}
          >
            <i className="fas fa-plus"></i> Add Technical Skill
          </button>
        </div>
      </div>
      
      <div className="skills-section">
        <h3 className="section-subheader">Soft Skills</h3>
        
        <div className="skills-list">
          {skillsData?.soft?.length > 0 ? (
            skillsData.soft.map((skill, index) => (
              <div key={index} className="skill-card">
                <div className="skill-header">
                  <h4 className="skill-title">Soft Skill #{index + 1}</h4>
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => deleteSkill('soft', index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                <div className="skill-content">
                  <div className="form-group">
                    <label>Skill Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Communication" 
                      value={skill.name || ''}
                      onChange={(e) => updateSkill('soft', index, 'name', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <i className="fas fa-comment"></i>
              <p>No soft skills added yet.</p>
            </div>
          )}
        </div>
        
        <div className="section-footer">
          <button 
            className="btn-add-skill" 
            onClick={handleAddSoftSkill}
          >
            <i className="fas fa-plus"></i> Add Soft Skill
          </button>
        </div>
      </div>
      
      <div className="skills-section">
        <h3 className="section-subheader">Languages</h3>
        
        <div className="skills-list">
          {skillsData?.languages?.length > 0 ? (
            skillsData.languages.map((skill, index) => (
              <div key={index} className="skill-card">
                <div className="skill-header">
                  <h4 className="skill-title">Language #{index + 1}</h4>
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => deleteSkill('languages', index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                <div className="skill-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Language</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Hindi" 
                        value={skill.name || ''}
                        onChange={(e) => updateSkill('languages', index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Proficiency Level</label>
                      <select 
                        className="form-control" 
                        value={skill.level || 'intermediate'}
                        onChange={(e) => updateSkill('languages', index, 'level', e.target.value)}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="elementary">Elementary</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                        <option value="native">Native</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <i className="fas fa-language"></i>
              <p>No languages added yet.</p>
            </div>
          )}
        </div>
        
        <div className="section-footer">
          <button 
            className="btn-add-skill" 
            onClick={handleAddLanguage}
          >
            <i className="fas fa-plus"></i> Add Language
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsEditor; 
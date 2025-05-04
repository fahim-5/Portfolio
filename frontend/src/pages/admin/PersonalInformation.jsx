import React from 'react';
import styles from './adminDashboard.module.css';
import PersonalInfoEditor from './PersonalInfoEditor';

const PersonalInformation = (props) => {
  return (
    <div className={styles['content-section']}>
      <PersonalInfoEditor {...props} />
    </div>
  );
};

export default PersonalInformation;

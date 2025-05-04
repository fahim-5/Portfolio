import React from 'react';
import styles from './adminDashboard.module.css';
import EducationEditor from './EducationEditor';

const Education = (props) => {
  return (
    <div className={styles['content-section']}>
      <EducationEditor {...props} />
    </div>
  );
};

export default Education;

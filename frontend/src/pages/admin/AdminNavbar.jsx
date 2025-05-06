import React from 'react';
import styles from './AdminNavbar.module.css';

const AdminNavbar = () => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'references', label: 'References' }
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>Fahim Faysal</h1>
        </div>
        <nav>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.id} className={styles.navItem}>
                <a 
                  href={`#${item.id}`} 
                  className={styles.navLink}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AdminNavbar;
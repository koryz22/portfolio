import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUser, 
  faFolderOpen, 
  faCode, 
  faEnvelope 
} from '@fortawesome/free-solid-svg-icons';
import './Navigation.css';

interface NavigationProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isMenuOpen, toggleMenu, closeMenu }) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      closeMenu();
    }
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <button 
          className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="line top"></span>
          <span className="line bottom"></span>
        </button>
        <button 
          className="logo"
          onClick={() => scrollToSection('home')}
          aria-label="Go to home"
        >
          kz
        </button>
      </header>

      {/* Navigation Menu */}
      <nav className={`navigation-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="nav-content">
          <button 
            className="nav-item"
            onClick={() => scrollToSection('home')}
          >
            <FontAwesomeIcon icon={faHome} className="nav-icon" />
            <span className="nav-text">home</span>
          </button>
          <button 
            className="nav-item"
            onClick={() => scrollToSection('about')}
          >
            <FontAwesomeIcon icon={faUser} className="nav-icon" />
            <span className="nav-text">about me</span>
          </button>
          <button 
            className="nav-item"
            onClick={() => scrollToSection('projects')}
          >
            <FontAwesomeIcon icon={faFolderOpen} className="nav-icon" />
            <span className="nav-text">projects</span>
          </button>
          <button 
            className="nav-item"
            onClick={() => scrollToSection('skills')}
          >
            <FontAwesomeIcon icon={faCode} className="nav-icon" />
            <span className="nav-text">skills</span>
          </button>
          <button 
            className="nav-item"
            onClick={() => scrollToSection('contact')}
          >
            <FontAwesomeIcon icon={faEnvelope} className="nav-icon" />
            <span className="nav-text">contact</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navigation;

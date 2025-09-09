import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="copyright">
          {/* <FontAwesomeIcon icon={faCopyright} className="copyright-icon" /> */}
          <span>© 2025 - Kory Z.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

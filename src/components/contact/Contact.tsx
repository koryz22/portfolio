import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComment, 
  faEnvelope, 
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import './Contact.css';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-content">
        <h2>
          let's chat!
          <FontAwesomeIcon icon={faComment} className="chat-icon" size="sm"/>
        </h2>
        <p className="contact-description">
          i'm always eager to connect with new people and discuss new opportunities,
          please feel free to contact me!
        </p>
        
        <div className="contact-form-container">
          <h3 className="form-title">Send me a message</h3>
          <form className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="form-input"
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="form-input"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                className="form-textarea"
                placeholder="Your message here..."
                rows={6}
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
      
      <div className="contact-footer">
        <div className="contact-footer-content">
          <span className="contact-footer-item">
            <FontAwesomeIcon icon={faEnvelope} className="footer-icon" />
            koryy.zhang@gmail.com
          </span>
          <span className="contact-footer-separator">|</span>
          <span className="contact-footer-item">
            <FontAwesomeIcon icon={faPhone} className="footer-icon" />
            +1 (925) 577-8014
          </span>
          <span className="contact-footer-separator">|</span>
          <a 
            href="https://linkedin.com/in/koryz" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="contact-footer-item"
          >
            <FontAwesomeIcon icon={faLinkedin} className="footer-icon" />
            koryz
          </a>
          <span className="contact-footer-separator">|</span>
          <a 
            href="https://github.com/koryz22" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="contact-footer-item"
          >
            <FontAwesomeIcon icon={faGithub} className="footer-icon" />
            koryz22
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComment, 
  faEnvelope, 
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import './Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    message: false
  });

  const [showToast, setShowToast] = useState(false);
  const [toastExiting, setToastExiting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      email: !formData.email.trim(),
      message: !formData.message.trim()
    };
    
    setErrors(newErrors);
    const isValid = !Object.values(newErrors).some(error => error);
    
    if (!isValid) {
      setShowToast(true);
      setToastExiting(false);
      // Start exit animation after 2.5 seconds, then hide after 3 seconds total
      setTimeout(() => {
        setToastExiting(true);
        setTimeout(() => setShowToast(false), 500);
      }, 2500);
    }
    
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before proceeding
    if (!validateForm()) {
      return; // Stop if validation fails
    }
    
    // Create mailto URL with pre-filled content
    const subject = encodeURIComponent(`Hi Kory! Message from ${formData.name}.`);
    
    // Get current date in MM/DD/YYYY format
    const currentDate = new Date();
    const dateString = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    
    const body = encodeURIComponent(
      `From: ${formData.name}\nDate: ${dateString}\n\nMessage:\n-----------\n${formData.message}`
    );
    const mailtoUrl = `mailto:koryy.zhang@gmail.com?subject=${subject}&body=${body}`;
    
    // Open the default mail app
    window.location.href = mailtoUrl;
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-content">
        <h2>
          let's chat!
          <FontAwesomeIcon icon={faComment} className="chat-icon" size="sm"/>
        </h2>
        <div className="contact-divider"></div>
        <p className="contact-description">
          i'm always eager to connect with new people, discuss interests, and explore new opportunities.
          feel free to reach out, i'd love to hear from you!
        </p>
        
        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Full name..."
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email..."
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                className={`form-textarea ${errors.message ? 'error' : ''}`}
                placeholder="Cast your words into the ether..."
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
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
      
      {/* Toast Notification */}
      {showToast && (
        <div className={`toast-notification ${toastExiting ? 'exiting' : ''}`}>
          Please fill out all required fields!
        </div>
      )}
    </section>
  );
};

export default Contact;

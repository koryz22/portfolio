import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import './About.css';

const About: React.FC = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-content">
        <h2>my dream is...</h2>
        <p>
          to share my story, ideas, and solutions with the world. 
          i'm a compassionate software engineer, eager to
          deliver applications with a beautiful and lasting impact 
          to real people. it's always customer first.
        </p>
        <p>
          outside of programming, i'm either running across San Francisco, 
          or conquering a new workout at the gym. 
          in the quiet hours of the morning, i love to read and prepare for the day ahead.
        </p>
        <div className="cloud-icon">
          <FontAwesomeIcon icon={faCloud} />
        </div>
      </div>
    </section>
  );
};

export default About;

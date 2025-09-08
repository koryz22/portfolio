import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import './Stories.css';

const Stories: React.FC = () => {
  const stories = [
    {
      id: 1,
      date: 'January 15, 2025',
      title: 'The Future of AI in Software Development',
      subtitle: 'Exploring how artificial intelligence is transforming the way we build and deploy applications.',
      link: '#'
    },
    {
      id: 2,
      date: 'December 28, 2024',
      title: 'Building Scalable Microservices',
      subtitle: 'Lessons learned from designing and implementing microservices architecture in production environments.',
      link: '#'
    },
    {
      id: 3,
      date: 'November 10, 2024',
      title: 'React Performance Optimization Techniques',
      subtitle: 'Advanced strategies for optimizing React applications and improving user experience.',
      link: '#'
    }
  ];

  return (
    <section id="stories" className="stories-section">
      <div className="stories-content">
        <h2 className="stories-title">stories</h2>
        <div className="stories-divider"></div>
        <div className="stories-grid">
          {stories.map((story) => (
            <div key={story.id} className="story-item">
              <div className="story-date">{story.date}</div>
              <h3 className="story-title">{story.title}</h3>
              <div className="story-link-container">
                <FontAwesomeIcon icon={faExternalLinkAlt} className="story-link-icon" />
                <span className="story-subtitle">{story.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stories;

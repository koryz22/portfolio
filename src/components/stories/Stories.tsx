import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import './Stories.css';

const Stories: React.FC = () => {
  const stories = [
    {
      id: 1,
      date: 'September 8, 2025',
      title: 'vanity & introspection',
      subtitle: 'coming soon...',
      link: '#'
    },
    {
      id: 2,
      date: 'April 6, 2025',
      title: 'to live is to die',
      subtitle: 'coming soon...',
      link: '#'
    },
    {
      id: 3,
      date: 'October 22, 2024',
      title: 'the purpose of working hard',
      subtitle: 'coming soon...',
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

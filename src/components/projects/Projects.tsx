import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRocket, 
  faCarBurst, 
  faDatabase, 
  faCircleNodes,
  faGamepad,
  faPalette
} from '@fortawesome/free-solid-svg-icons';
import './Projects.css';

const Projects: React.FC = () => {
  const projects = [
    {
      id: 1,
      icon: faCarBurst,
      name: 'Car Part Picker',
      description: 'Build your own car.'
    },
    {
      id: 2,
      icon: faDatabase,
      name: 'Oppscout',
      description: 'Ingest data from multiple sources and analyze it.'
    },
    {
      id: 3,
      icon: faRocket,
      name: 'Astrochecker',
      description: 'A tool to help you improve your grammar.'
    },
    {
      id: 4,
      icon: faCircleNodes,
      name: 'Cluster Analysis Tool',
      description: 'Analyze data from multiple sources and visualize it.'
    },
  ];

  return (
    <section id="projects" className="projects-section">
      <div className="projects-content">
        <h2 className="projects-title">projects</h2>
        <div className="projects-divider"></div>
        <div className="projects-divider-2"></div>
        <div className="projects-list">
          {projects.map((project) => (
            <div key={project.id} className="project-item">
              <div className="project-icon-container">
                <FontAwesomeIcon icon={project.icon} className="project-icon" />
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.name}</h3>
                <p className="project-description">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

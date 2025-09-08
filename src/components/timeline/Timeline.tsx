import React from 'react';
import './Timeline.css';

interface Experience {
  company: string;
  title: string;
  period: string;
}

const Timeline: React.FC = () => {
  const experiences: Experience[] = [
    {
      company: "Robert Half (Protiviti Applications)",
      title: "Software Engineer I",
      period: "Apr 2024 - Present"
    },
    {
      company: "Robert Half",
      title: "Software Engineer Intern",
      period: "June 2023 - Mar 2024"
    },
    {
      company: "Commit The Change",
      title: "Software Developer",
      period: "Oct 2021 - June 2023"
    },
    {
      company: "Gausscode Technology Inc.",
      title: "Software Engineer Intern",
      period: "July 2022 - Sep 2022"
    }
  ];

  return (
    <section id="experience" className="timeline-container">
      <div className="timeline-content-wrapper">
        <h2 className="timeline-title">Experience</h2>
        <div className="timeline">
          {experiences.map((experience, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3 className="company-name">{experience.company}</h3>
                  <span className="period">{experience.period}</span>
                </div>
                <p className="job-title">{experience.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;

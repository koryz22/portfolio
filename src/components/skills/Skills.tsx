import React from 'react';
import './Skills.css';

interface SkillCategory {
  title: string;
  skills: string[];
}

const Skills: React.FC = () => {
  const skillCategories: SkillCategory[] = [
    {
      title: "Languages",
      skills: ["Python", "Java", "C++", "C#", "Apex", "JavaScript", "TypeScript", "HTML / CSS"]
    },
    {
      title: "Frameworks",
      skills: ["React", "Angular", "Node.js", "Flask", "Express", "Bootstrap"]
    },
    {
      title: "Tools & Platforms",
      skills: ["AWS", "Azure", "Git", "Postman", "Splunk", "Salesforce", "Jira"]
    }
  ];

  return (
    <section id="skills" className="skills-section">
      <div className="skills-content">
        <h2 className="skills-title">skills</h2>
        <div className="skills-divider"></div>
        <div className="skills-grid">
          {skillCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="skill-category">
              <div className="category-header">
                <h3 className="category-title">{category.title}</h3>
              </div>
              <div className="skills-list">
                {category.skills.map((skill, skillIndex) => (
                  <span key={skillIndex} className="skill-item">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

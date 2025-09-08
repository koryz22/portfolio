import React from 'react';
import './Skills.css';

interface SkillCategory {
  title: string;
  skills: string[];
  icon: string;
}

const Skills: React.FC = () => {
  const skillCategories: SkillCategory[] = [
    {
      title: "Languages",
      icon: "💻",
      skills: ["Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "HTML/CSS"]
    },
    {
      title: "Frameworks",
      icon: "⚡",
      skills: ["React", "Angular", "Node.js", "Flask", "Express", "Bootstrap"]
    },
    {
      title: "Tools",
      icon: "🛠️",
      skills: ["Git", "AWS", "Azure", "Docker", "Postman", "Figma"]
    },
    {
      title: "Platforms",
      icon: "☁️",
      skills: ["Salesforce", "Jira", "Splunk", "Slack", "GitHub", "Vercel"]
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
                <span className="category-icon">{category.icon}</span>
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

import React from 'react';
import Home from '../components/home/Home';
import About from '../components/about/About';
import Projects from '../components/projects/Projects';
import Skills from '../components/skills/Skills';
import Stories from '../components/stories/Stories';
// import Timeline from '../components/timeline/Timeline';
import Contact from '../components/contact/Contact';
import Footer from '../components/footer/Footer';
import './Landing.css';

const Landing: React.FC = () => {
  return (
    <div className="landing-page">
      <Home />
      <About />
      <Projects />
      <Stories />
      <Skills />
      {/* <Timeline /> */}
      <Contact />
      <Footer />
    </div>
  );
};

export default Landing;

import React, { useState, useEffect } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const subtitles = [
    'full-stack engineer',
    'part-time dog sitter',
    'music producer',
    'keyboard enthusiast'
  ];

  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentSubtitleIndex((prevIndex) => 
          (prevIndex + 1) % subtitles.length
        );
        setIsTransitioning(false);
      }, 500); // Half a second for fade out
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [subtitles.length]);

  return (
    <section id="home" className="home-section">
      <div className="home-content">
        <h1>kory<br/>zhang!</h1>
        <p className={`subtitle ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          {subtitles[currentSubtitleIndex]}
        </p>
      </div>
    </section>
  );
};

export default Home;

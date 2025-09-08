import React, { useState } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import Landing from './pages/Landing';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="App">
      <Navigation 
        isMenuOpen={isMenuOpen} 
        toggleMenu={toggleMenu} 
        closeMenu={closeMenu}
      />
      <main>
        <Landing />
      </main>
    </div>
  );
}

export default App;
